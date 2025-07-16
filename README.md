# Project: MyDuka
## Problem statement
Record keeping and stock taking are an essential part of every business entity. This is used to make more informed decisions in regard to different aspects of operations. There are several approaches to achieve this, but a few businesses get to use more noble options, like apps that can generate automated reports, hence this becomes a tedious task to get more accurate information due to different reasons.

## Solution:
Create an inventory app that can help in stock taking, generation and visualization of weekly, monthly and annual reports.

## Team
Full Stack - React(Frontend) & Python Flask(Backend)

## Features:
**Authentication** - Only the superuser(This could be the merchant) can initialize the registration process to add an admin by sending a tokenized link to their email from which the invitee can register within a reasonable amount of time.
The admins upon registration are responsible for adding data entry clerks

**A dashboard where clerks can record details for the received items in the store:**
- The number of items received
- The status of payment(paid or not paid), this is important for procurement processes.
- The number of items in stock.
- The number of items spoilt( Broken, expired and anything else).
- Buying and selling price.
On the same dashboard there should be an option to request for more product supply - this request goes to the store admin

**The store admin should be able:**
- To see a detailed report on the performance of individual entries.
- To approve or decline supply requests from the clerk.
- To see the products that suppliers have been paid and those not yet - this should be well separated to ensure ease of viewing.
- To change the payment status to paid for the products that were not paid - Ideally this happens after the suppliers have been paid.
- To inactivate or delete a clerks account and as well add new clerks.
As above mentioned the report should be in a good graphical representation; that is, linear graphs and bar graphs as a requirement - pie charts are totally optional.

**The merchant should be able to:**
- Add an admin, deactivate and delete their accounts - PS deactivation is independent from deleting the account, it is important for probation purposes.
- Should be able to see a store by store report in well visualized graphs
- To see an individual store performance, even narrowing down to individual product performance.
- To see the paid and non paid products for each store.

## Technical expectations
- *Backend*: Python Flask
- *Database*: PostgreSQL
- *Wireframes*: Figma (Should be mobile friendly)
- *Testing Framework*: ​Jest & Minitests
- *Frontend*: ReactJs &Redux Toolkit(state management)
You can use any Js Plotting Library for visualization

