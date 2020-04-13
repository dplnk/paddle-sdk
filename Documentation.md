# Paddle.com Node.js SDK Documentation

Welcome to the [Paddle.com](http://www.paddle.com/) Node.js SDK documentation.

<a name="PaddleSDK"></a>

## PaddleSDK
**Kind**: global class  

* [PaddleSDK](#PaddleSDK)
    * [new PaddleSDK(vendorId, authCode, [publicKey], [options])](#new_PaddleSDK_new)
    * [.getProducts()](#PaddleSDK+getProducts) ⇒ <code>Promise</code>
    * [.getProductCoupons(productId)](#PaddleSDK+getProductCoupons) ⇒ <code>Promise</code>
    * [.getProductPlans([plan])](#PaddleSDK+getProductPlans) ⇒ <code>Promise</code>
    * [.getPlanUsers([filter], [pagination])](#PaddleSDK+getPlanUsers) ⇒ <code>Promise</code>
    * [.getPlanPayments([filter])](#PaddleSDK+getPlanPayments) ⇒ <code>Promise</code>
    * [.getWebhooksHistory([pagination])](#PaddleSDK+getWebhooksHistory) ⇒ <code>Promise</code>
    * [.getUserTransactions(userId)](#PaddleSDK+getUserTransactions) ⇒ <code>Promise</code>
    * [.getSubscriptionTransactions(subscriptionId)](#PaddleSDK+getSubscriptionTransactions) ⇒ <code>Promise</code>
    * [.getOrderTransactions(orderId)](#PaddleSDK+getOrderTransactions) ⇒ <code>Promise</code>
    * [.getCheckoutTransactions(checkoutID)](#PaddleSDK+getCheckoutTransactions) ⇒ <code>Promise</code>
    * [.verifyWebhookData(postData)](#PaddleSDK+verifyWebhookData) ⇒ <code>boolean</code>
    * [.updateSubscriptionPlan(subscriptionId, planId, prorate)](#PaddleSDK+updateSubscriptionPlan) ⇒ <code>Promise</code>
    * [.cancelSubscription(subscriptionId)](#PaddleSDK+cancelSubscription) ⇒ <code>Promise</code>
    * [.generatePayLink(body)](#PaddleSDK+generatePayLink) ⇒ <code>Promise</code>

<a name="new_PaddleSDK_new"></a>

### new PaddleSDK(vendorId, authCode, [publicKey], [options])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| vendorId | <code>string</code> |  | The vendor ID for a Paddle account |
| authCode | <code>string</code> |  | The Auth Code for a Paddle account |
| [publicKey] | <code>string</code> |  | The public key for a Paddle account used to verify webhooks, only required for `verifyWebhookData` |
| [options] | <code>object</code> |  |  |
| [options.server] | <code>string</code> | <code>&quot;vendors.paddle.com/api/2.0&quot;</code> | The server URL prefix for all requests |

**Example**  
```js
const client = new PaddleSDK('your-vendor-id', 'your-auth-code');
const client = new PaddleSDK('your-vendor-id', 'your-auth-code', 'your-public-key');
```
<a name="PaddleSDK+getProducts"></a>

### client.getProducts() ⇒ <code>Promise</code>
Get the current list of products

**Kind**: instance method of [<code>PaddleSDK</code>](#PaddleSDK)  
**Fulfil**: <code>object</code> - The products list  
**Example**  
```js
const products = await client.getProducts();
```
<a name="PaddleSDK+getProductCoupons"></a>

### client.getProductCoupons(productId) ⇒ <code>Promise</code>
Get the current list of coupons for a product

**Kind**: instance method of [<code>PaddleSDK</code>](#PaddleSDK)  
**Fulfil**: <code>object</code> - The coupons list  

| Param | Type | Description |
| --- | --- | --- |
| productId | <code>number</code> | The specific product/subscription ID. |

**Example**  
```js
const coupons = await client.getProductCoupons(123);
```
<a name="PaddleSDK+getProductPlans"></a>

### client.getProductPlans([plan]) ⇒ <code>Promise</code>
Get the current list of plans for a subscription

**Kind**: instance method of [<code>PaddleSDK</code>](#PaddleSDK)  
**Fulfil**: <code>object</code> - The plans list  

| Param | Type | Description |
| --- | --- | --- |
| [plan] | <code>number</code> | Filter: The product/plan ID |

**Example**  
```js
const plans = await client.getProductPlans(123);
```
<a name="PaddleSDK+getPlanUsers"></a>

### client.getPlanUsers([filter], [pagination]) ⇒ <code>Promise</code>
Get the current list of users for a subscription plan

**Kind**: instance method of [<code>PaddleSDK</code>](#PaddleSDK)  
**Fulfil**: <code>object</code> - The users list  

| Param | Type | Description |
| --- | --- | --- |
| [filter] |  |  |
| [filter.subscriptionId] | <code>number</code> | A specific user subscription ID |
| [filter.planId] | <code>number</code> | The subscription plan ID |
| [filter.state] | <code>&#x27;active&#x27;</code> \| <code>&#x27;past due&#x27;</code> \| <code>&#x27;trialling&#x27;</code> \| <code>&#x27;paused&#x27;</code> | The user subscription status. Returns all active, past due, trialling and paused subscription plans if not specified. |
| [pagination] |  |  |
| [pagination.page] | <code>number</code> | Paginate return results |
| [pagination.resultPerPage] | <code>number</code> | Number of subscription records to return per page. |

**Example**  
```js
const users = await client.getPlanUsers({subscriptionId: 123});
```
<a name="PaddleSDK+getPlanPayments"></a>

### client.getPlanPayments([filter]) ⇒ <code>Promise</code>
Get the list of payments for a subscription plan

**Kind**: instance method of [<code>PaddleSDK</code>](#PaddleSDK)  
**Fulfil**: <code>object</code> - The payments list  

| Param | Type | Description |
| --- | --- | --- |
| [filter] |  |  |
| [filter.subscriptionId] | <code>number</code> |  |
| [filter.plan] | <code>number</code> |  |
| [filter.isPaid] | <code>0</code> \| <code>1</code> | Filter: Payment is paid (0 = No, 1 = Yes) |
| [filter.from] | <code>string</code> | Filter: Payments starting from (date in format YYYY-MM-DD) |
| [filter.to] | <code>string</code> | Filter: Payments up to (date in format YYYY-MM-DD) |
| [filter.isOneOffCharge] | <code>boolean</code> |  |

**Example**  
```js
const payments = await client.getPlanPayments(123);
```
<a name="PaddleSDK+getWebhooksHistory"></a>

### client.getWebhooksHistory([pagination]) ⇒ <code>Promise</code>
Get the list of webhooks history

**Kind**: instance method of [<code>PaddleSDK</code>](#PaddleSDK)  
**Fulfil**: <code>object</code> - The webhooks history list  

| Param | Type | Description |
| --- | --- | --- |
| [pagination] |  |  |
| [pagination.page] | <code>number</code> | Paginate returned results |
| [pagination.alertPerPage] | <code>string</code> | Number of webhook records to return per page |
| [pagination.queryHead] | <code>string</code> | The date-time from which to begin the history |

**Example**  
```js
const webhooksHistory = await client.getWebhooksHistory();
```
<a name="PaddleSDK+getUserTransactions"></a>

### client.getUserTransactions(userId) ⇒ <code>Promise</code>
Get the list of transations for a user

**Kind**: instance method of [<code>PaddleSDK</code>](#PaddleSDK)  
**Fulfil**: <code>object</code> - The transations list  

| Param | Type |
| --- | --- |
| userId | <code>number</code> | 

**Example**  
```js
const userTransactions = await client.getUserTransactions(123);
```
<a name="PaddleSDK+getSubscriptionTransactions"></a>

### client.getSubscriptionTransactions(subscriptionId) ⇒ <code>Promise</code>
Get the list of transations for a subscription

**Kind**: instance method of [<code>PaddleSDK</code>](#PaddleSDK)  
**Fulfil**: <code>object</code> - The transations list  

| Param | Type |
| --- | --- |
| subscriptionId | <code>number</code> | 

**Example**  
```js
const subscriptionTransactions = await client.getSubscriptionTransactions(123);
```
<a name="PaddleSDK+getOrderTransactions"></a>

### client.getOrderTransactions(orderId) ⇒ <code>Promise</code>
Get the list of transations for an order

**Kind**: instance method of [<code>PaddleSDK</code>](#PaddleSDK)  
**Fulfil**: <code>object</code> - The transations list  

| Param | Type |
| --- | --- |
| orderId | <code>number</code> | 

**Example**  
```js
const orderTransactions = await client.getOrderTransactions(123);
```
<a name="PaddleSDK+getCheckoutTransactions"></a>

### client.getCheckoutTransactions(checkoutID) ⇒ <code>Promise</code>
Get the list of transations for a checkout

**Kind**: instance method of [<code>PaddleSDK</code>](#PaddleSDK)  
**Fulfil**: <code>object</code> - The transations list  

| Param | Type |
| --- | --- |
| checkoutID | <code>number</code> | 

**Example**  
```js
const checkoutTransactions = await client.getCheckoutTransactions(123);
```
<a name="PaddleSDK+verifyWebhookData"></a>

### client.verifyWebhookData(postData) ⇒ <code>boolean</code>
Verify a webhook alert data using signature and a public key to validate that
it was indeed sent from Paddle.

For more details: https://paddle.com/docs/reference-verifying-webhooks

**Kind**: instance method of [<code>PaddleSDK</code>](#PaddleSDK)  

| Param | Type | Description |
| --- | --- | --- |
| postData | <code>Object</code> | The object with all the parameters sent to the webhook |

**Example**  
```js
const client = new PaddleSDK('your-vendor-id', 'your-auth-code', 'your-public-key');

// inside an Express handler which uses express.bodyParser middleware
const isVerified = client.verifyWebhookData(req.body);
```
<a name="PaddleSDK+updateSubscriptionPlan"></a>

### client.updateSubscriptionPlan(subscriptionId, planId, prorate) ⇒ <code>Promise</code>
Update (upgrade/downgrade) the plan of a subscription

**Kind**: instance method of [<code>PaddleSDK</code>](#PaddleSDK)  
**Fulfill**: <code>object</code> - The result of the operation  

| Param | Type | Default |
| --- | --- | --- |
| subscriptionId | <code>number</code> |  | 
| planId | <code>number</code> |  | 
| prorate | <code>boolean</code> | <code>false</code> | 

**Example**  
```js
const result = await client.updateSubscriptionPlan(123);
```
<a name="PaddleSDK+cancelSubscription"></a>

### client.cancelSubscription(subscriptionId) ⇒ <code>Promise</code>
Cancels an active subscription

**Kind**: instance method of [<code>PaddleSDK</code>](#PaddleSDK)  
**Fulfil**: <code>object</code> - The result of the operation  

| Param | Type | Description |
| --- | --- | --- |
| subscriptionId | <code>number</code> | The specific user subscription ID. |

**Example**  
```js
const result = await client.cancelSubscription(123);
```
<a name="PaddleSDK+generatePayLink"></a>

### client.generatePayLink(body) ⇒ <code>Promise</code>
Generate a custom pay link

**Kind**: instance method of [<code>PaddleSDK</code>](#PaddleSDK)  
**Fulfil**: <code>object</code> - The new pay link url  

| Param | Type |
| --- | --- |
| body | <code>object</code> | 

**Example**  
```js
const custom = await client.generatePayLink({
 "title" : "my custom checkout",
 "custom_message" : "some custom message"
	"prices": [
		"USD:19.99",
		"EUR:15.99"
	 ]
	});
```
---

Documentation generated on **Mon, 13 Apr 2020 02:32:41 GMT**
