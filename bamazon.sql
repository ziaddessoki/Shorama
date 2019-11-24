DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT default 0,
  PRIMARY KEY (id)
);


INSERT INTO products (product_name, department_name, price,stock_quantity)
VALUES ("Bicycle", "Sport", 89.9, 10),
("Sofa", "Furniture", 800, 5),
("TV", "Electronics", 110, 20),
("Laptop", "Electronics", 700, 50),
("Dumbells", "Sport", 19.9, 100),
("Lamp", "Furniture", 25, 500),
("Lazyboy", "Furniture", 800, 30),
("Hoddie", "Clothing", 150, 80),
("Pants", "Clothing", 80, 80),
("Iphone", "Electronics", 999.9, 39);

SELECT * FROM products;

DELETE FROM products WHERE id  IN (0,30);

