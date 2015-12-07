jorrieb_mattmik_aezhou_marcosp_final
====================================

#Grubsplit

##Usage Notes
1. Go [here](https://grubsplit.herokuapp.com) to view the app.
2. After signing up/in to GrubSplit, you will be redirected to Delivery.com, where you'll be asked to login or sign up. If you already have a profile with Delivery.com, feel free to use it. If not, sign up as before. 
3. Restaurant search is live but Delivery.com requires the addresses to either be in the form of ‘Address, City, State’ or ‘Address, Zip'.
4. Placing an order will bring you to a page to add your delivery address and payment information - once confirmed, your order will officially be placed and on its way to you!

##Final Version Notes
We had to change the flow of our checkout process and add an extra page (that is not in our initial design). Delivery.com needs a shipping address and payment information, so we added a final checkout page to the flow. This page has shipping address and payment information, in addition to a summary of the final order. From here, you confirm your order and send the order to the restaurant via Delivery.com.

Additionally, we wished to write unit tests for the Delivery.js library. However, we all struggled trying to get an account for the sandbox website that Delivery.com offers. Since these methods involve API calls to Delivery.com, it was not feasible to write a suite of tests against the production website. We did, however, extensively test our various requests using postman and other tools.