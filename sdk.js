const crypto = require('crypto');
const got = require('got');

const pkg = require('./package.json');
const serialize = require('./lib/serialize');

const SERVER_URL = 'https://vendors.paddle.com/api/2.0';

class PaddleSDK {
	/**
	 * @class PaddleSDK
	 * @typicalname client
	 * @param {string} vendorId - The vendor ID for a Paddle account
	 * @param {string} authCode - The Auth Code for a Paddle account
	 * @param {string} [publicKey] - The public key for a Paddle account used to verify webhooks, only required for `verifyWebhookData`
	 * @param {object} [options]
	 * @param {string} [options.server=vendors.paddle.com/api/2.0] - The server URL prefix for all requests
	 *
	 * @example
	 * const client = new PaddleSDK('your-vendor-id', 'your-auth-code');
	 * const client = new PaddleSDK('your-vendor-id', 'your-auth-code', 'your-public-key');
	 */
	constructor(vendorId, authCode, publicKey, options) {
		this.vendorId = vendorId || 'MISSING';
		this.authCode = authCode || 'MISSING';
		this.publicKey = publicKey || 'MISSING';
		this.server = (options && options.server) || SERVER_URL;
	}

	/**
	 * Execute a HTTP request
	 *
	 * @private
	 * @param path
	 * @param {string} url - url to do request
	 * @param {object} [options.body] - body parameters / object
	 * @param {object} [options.headers] - header parameters
	 * @param {boolean} [options.form] - form parameter (ref: got package)
	 * @param {boolean} [options.json] - json parameter (ref: got package)
	 */
	_request(path, { body = {}, headers = {}, form = true, json = false } = {}) {
		const url = this.server + path;
		const fullBody = Object.assign(body, this._getDefaultBody());

		const options = {
			headers: this._getDefaultHeaders(headers),
			method: 'POST',
		};
		if (form) {
			options.form = fullBody;
		}
		if (json) {
			options.json = fullBody;
		}

		return got(url, options)
			.json()
			.then(body => {
				if (typeof body.success === 'boolean') {
					if (body.success) {
						return body.response || body;
					}

					throw new Error(
						`Request ${url} returned an error! response=${JSON.stringify(body)}`
					);
				}

				return body;
			});
	}

	_getDefaultBody() {
		return {
			vendor_id: this.vendorId,
			vendor_auth_code: this.authCode,
		};
	}

	/**
	 * Get the list of required headers for an API request
	 *
	 * @private
	 * @param {object} [additionalHeaders={}] - headers object
	 */
	_getDefaultHeaders(additionalHeaders) {
		return Object.assign(
			{
				'User-Agent': `paddle-sdk-dplnk/${pkg.version} (${pkg.repository.url})`,
			},
			additionalHeaders || {}
		);
	}

	/**
	 * Get the current list of products
	 *
	 * @method
	 * @returns {Promise}
	 * @fulfil {object} - The products list
	 *
	 * @example
	 * const products = await client.getProducts();
	 */
	getProducts() {
		return this._request('/product/get_products');
	}

	/**
	 * Get the current list of coupons for a product
	 *
	 * @method
	 * @param {number} productId - The specific product/subscription ID.
	 * @returns {Promise}
	 * @fulfil {object} - The coupons list
	 *
	 * @example
	 * const coupons = await client.getProductCoupons(123);
	 */
	getProductCoupons(productId) {
		return this._request('/product/list_coupons', {
			body: { product_id: productId },
		});
	}

	/**
	 * Get the current list of plans for a subscription
	 *
	 * @method
	 * @param {number} [plan] - Filter: The product/plan ID
	 * @returns {Promise}
	 * @fulfil {object} - The plans list
	 *
	 * @example
	 * const plans = await client.getProductPlans(123);
	 */
	getProductPlans(plan) {
		return this._request('/subscription/plans', {
			body: { plan },
		});
	}

	/**
	 * Get the current list of users for a subscription plan
	 *
	 * @method
	 * @param [filter]
	 * @param {number} [filter.subscriptionId] - A specific user subscription ID
	 * @param {number} [filter.planId] - The subscription plan ID
	 * @param {'active' | 'past due' | 'trialling' | 'paused'} [filter.state] - The user subscription status.
	 * Returns all active, past due, trialling and paused subscription plans if not specified.
	 * @param [pagination]
	 * @param {number} [pagination.page] - Paginate return results
	 * @param {number} [pagination.resultPerPage] - Number of subscription records to return per page.
	 * @returns {Promise}
	 * @fulfil {object} - The users list
	 *
	 * @example
	 * const users = await client.getPlanUsers({subscriptionId: 123});
	 */
	getPlanUsers(filter, pagination) {
		return this._request('/subscription/users', {
			body: {
				subscriptionId: filter.subscriptionId,
				planId: filter.planId,
				state: filter.state,
				page: pagination.page,
				result_per_page: pagination.resultPerPage,
			},
		});
	}

	/**
	 * Get the list of payments for a subscription plan
	 *
	 * @method
	 * @param [filter]
	 * @param {number} [filter.subscriptionId]
	 * @param {number} [filter.plan]
	 * @param {0 | 1} [filter.isPaid] - Filter: Payment is paid (0 = No, 1 = Yes)
	 * @param {string} [filter.from] - Filter: Payments starting from (date in format YYYY-MM-DD)
	 * @param {string} [filter.to] - Filter: Payments up to (date in format YYYY-MM-DD)
	 * @param {boolean} [filter.isOneOffCharge]
	 * @returns {Promise}
	 * @fulfil {object} - The payments list
	 *
	 * @example
	 * const payments = await client.getPlanPayments(123);
	 */
	getPlanPayments(filter) {
		return this._request('/subscription/payments', {
			body: {
				subscription_id: filter.subscriptionId,
				plan: filter.plan,
				is_paid: filter.isPaid,
				from: filter.from,
				to: filter.to,
				is_one_off_charge: filter.isOneOffCharge,
			},
		});
	}

	/**
	 * Get the list of webhooks history
	 *
	 * @method
	 * @param [pagination]
	 * @param {number} [pagination.page] - Paginate returned results
	 * @param {string} [pagination.alertPerPage] - Number of webhook records to return per page
	 * @param {string} [pagination.queryHead] The date-time from which to begin the history
	 * @returns {Promise}
	 * @fulfil {object} - The webhooks history list
	 *
	 * @example
	 * const webhooksHistory = await client.getWebhooksHistory();
	 */
	getWebhooksHistory(pagination) {
		return this._request('/alert/webhooks', {
			body: {
				page: pagination.page,
				alerts_per_page: pagination.alertPerPage,
				query_head: pagination.queryHead,
			},
		});
	}

	/**
	 * Get the list of transations for a resource
	 *
	 * @private
	 * @param {string} entity - Filter: Entity type of the id
	 * @param {string} id - Filter: ID number for the specified entity
	 * @returns {Promise}
	 * @fulfil {object} - The transations list
	 */
	_getTransactions(entity, id) {
		return this._request(`/${entity}/${id}/transactions`);
	}

	/**
	 * Get the list of transations for a user
	 *
	 * @method
	 * @param {number} userId
	 * @returns {Promise}
	 * @fulfil {object} - The transations list
	 *
	 * @example
	 * const userTransactions = await client.getUserTransactions(123);
	 */
	getUserTransactions(userId) {
		return this._getTransactions('users', `${userId}`);
	}

	/**
	 * Get the list of transations for a subscription
	 *
	 * @method
	 * @param {number} subscriptionId
	 * @returns {Promise}
	 * @fulfil {object} - The transations list
	 *
	 * @example
	 * const subscriptionTransactions = await client.getSubscriptionTransactions(123);
	 */
	getSubscriptionTransactions(subscriptionId) {
		return this._getTransactions('subscription', `${subscriptionId}`);
	}

	/**
	 * Get the list of transations for an order
	 *
	 * @method
	 * @param {number} orderId
	 * @returns {Promise}
	 * @fulfil {object} - The transations list
	 *
	 * @example
	 * const orderTransactions = await client.getOrderTransactions(123);
	 */
	getOrderTransactions(orderId) {
		return this._getTransactions('order', `${orderId}`);
	}

	/**
	 * Get the list of transations for a checkout
	 *
	 * @method
	 * @param {number} checkoutID
	 * @returns {Promise}
	 * @fulfil {object} - The transations list
	 *
	 * @example
	 * const checkoutTransactions = await client.getCheckoutTransactions(123);
	 */
	getCheckoutTransactions(checkoutID) {
		return this._getTransactions('checkout', `${checkoutID}`);
	}

	/**
	 * Verify a webhook alert data using signature and a public key to validate that
	 * it was indeed sent from Paddle.
	 *
	 * For more details: https://paddle.com/docs/reference-verifying-webhooks
	 *
	 * @method
	 * @param  {Object} postData The object with all the parameters sent to the webhook
	 * @return {boolean}
	 *
	 * @example
	 * const client = new PaddleSDK('your-vendor-id', 'your-auth-code', 'your-public-key');
	 *
	 * // inside an Express handler which uses express.bodyParser middleware
	 * const isVerified = client.verifyWebhookData(req.body);
	 */
	verifyWebhookData(postData) {
		const signature = postData.p_signature;

		const keys = Object.keys(postData)
			.filter(key => key !== 'p_signature')
			.sort();

		const sorted = {};
		keys.forEach(key => {
			sorted[key] = postData[key];
		});

		// PHP style serialize! :O
		const serialized = serialize(sorted);

		try {
			const verifier = crypto.createVerify('sha1');
			verifier.write(serialized);
			verifier.end();

			return verifier.verify(this.publicKey, signature, 'base64');
		} catch (err) {
			return false;
		}
	}

	// TODO: fix params
	/**
	 * Update (upgrade/downgrade) the plan of a subscription
	 *
	 * @method
	 * @param {number} subscriptionId
	 * @param {number} planId
	 * @param {boolean} prorate
	 * @returns {Promise}
	 * @fulfill {object} - The result of the operation
	 *
	 * @example
	 * const result = await client.updateSubscriptionPlan(123);
	 */
	updateSubscriptionPlan(subscriptionId, planId, prorate = false) {
		return this._request('/subscription/users/update', {
			body: {
				subscription_id: subscriptionId,
				plan_id: planId,
				prorate,
			},
		});
	}

	/**
	 * Cancels an active subscription
	 *
	 * @method
	 * @param {number} subscriptionId - The specific user subscription ID.
	 * @returns {Promise}
	 * @fulfil {object} - The result of the operation
	 *
	 * @example
	 * const result = await client.cancelSubscription(123);
	 */
	cancelSubscription(subscriptionId) {
		return this._request('/subscription/users_cancel', {
			body: { subscription_id: subscriptionId },
		});
	}

	/**
	 * Generate a custom pay link
	 *
	 * @method
	 * @param {object} body
	 * @returns {Promise}
	 * @fulfil {object} - The new pay link url
	 *
	 * @example
	 * const custom = await client.generatePayLink({
	 *  "title" : "my custom checkout",
	 *  "custom_message" : "some custom message"
	 * 	"prices": [
	 *		"USD:19.99",
	 *		"EUR:15.99"
	 *	 ]
	 *	});
	 */
	generatePayLink(body) {
		return this._request('/product/generate_pay_link', {
			body,
			form: false,
			json: true,
		});
	}
}

module.exports = PaddleSDK;
