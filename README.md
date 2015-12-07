jorrieb_mattmik_aezhou_marcosp_final
====================================

#Grubsplit

##Demo Notes
1. Go [here](https://grubsplit.herokuapp.com) to view the app.
2. After signing up/in to GrubSplit, you will be redirected to Delivery.com, where you'll be asked to login or sign up. If you already have a profile with Delivery.com, feel free to use it. If not, sign up as before. 
3. Regardless of the search parameters, the result will be Cafe 472. This result has been hard-coded in, but a query is taking place on the backend with the Delivery API. While the search result is hard-coded, the menu retreival of Cafe 472 is the true API response from the Delivery.com API.
4. The last thing to note Order Grub button doesn't yet work. On the backend, we have access to user payment information and thus can theoretically order something - however, the UI hasn't yet caught up with retrieving all the necessary information from the user for an actual order.

change to design

why we can't test libraries 