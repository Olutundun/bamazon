-- DROP database IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;
CREATE TABLE products (
  item_id INT AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(150),
  department_name VARCHAR(150),
  price DECIMAL(10,2),
  stock_quantity INT NULL DEFAULT 0,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("wristwatch", "jewelry", 98.50, 100), ("orange", "produce", 2.10, 120), ("laptop", "electronics", 250.00, 75),
       ("pen", "stationery", 24.20, 25), ("turkey", "frozen food", 5.00, 200), ("lamp", "household", 34.00, 85),
       ("tylenol", "pharmacy", 10.99, 105), ("battery", "automotive", 8.00, 55), ("flowers", "outdoor", 30.00, 68),
       ("ipod", "music", 120.00, 87);

ALTER TABLE products
ADD product_sales DECIMAL(10,2);

-- UPDATE products SET product_sales = 0;

CREATE TABLE departments (
  department_id INT AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(150),
  over_head_costs DECIMAL(10,2),
  PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("jewelry", 1000),
("produce", 8000),
("electronics", 2000),
("stationery", 2500),
("frozen food", 3500),
("household", 5500),
("pharmacy", 6000),
("Automotive", 4400),
("Outdoor", 7400),
("music", 9680);    

SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales
FROM departments INNER JOIN products ON (departments.department_name = products.department_name)
GROUP BY departments.department_name;

SELECT * FROM products;
