-- This file distrbiutes the Northwinds database across the Citus worker nodes.

SELECT create_distributed_table('categories', 'categoryid');
SELECT create_distributed_table('customercustomerdemo', 'customerid');
SELECT create_distributed_table('customerdemographics', 'customertypeid');
SELECT create_distributed_table('customers', 'customerid');
SELECT create_distributed_table('employees', 'employeeid');
SELECT create_distributed_table('employeeterritories', 'employeeid');
SELECT create_distributed_table('order_details', 'orderid');
SELECT create_distributed_table('orders', 'orderid', colocate_with => 'order_details');
SELECT create_distributed_table('products', 'productid');
SELECT create_distributed_table('shippers', 'shipperid');
SELECT create_distributed_table('suppliers', 'supplierid');

SELECT create_reference_table('region');
SELECT create_reference_table('territories');
SELECT create_reference_table('usstates');
SELECT create_reference_table('region');