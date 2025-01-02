const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());


const cors = require('cors');
app.use(cors());


//database setup
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
    } else {
      console.log('Connected to the MySQL database.');
    }
  });

  const isAdmin = (req, res, next) => {
    
    const admin = req.headers.admin === 'true'; 
    if (admin) next();
    else res.status(403).json({ error: 'Unauthorized: Admin access required' });
  };


//signup

  app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    const checkQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkQuery, [email], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error checking existing user' });
    } else if (results.length > 0) {
      res.status(409).json({ error: 'Email is already registered' });
    } else {
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, password], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error registering user' });
      } else {
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
      }
    });
  }
});
});

//login

  app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const adminEmail = "sivasankaravula128@gmail.com";
    const adminPassword = "asdfghjkl";

    if (email === adminEmail && password === adminPassword) {
      return res.json({
        isAdmin: true,
        message: "Admin login successful!",
      });
    }
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
   
    db.query(query, [email, password], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error logging in' });
      } else if (results.length > 0) {
        const user = results[0];
        res.json({ userId: user.id,isAdmin: false, message: "Login successful!" });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    });
  });
  

//user profile
app.get("/users", (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }
  const query = "SELECT * FROM users WHERE id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching user data" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = results[0];
    res.json({
      username: user.username,
      email: user.email,
      password:user.password,
      created_at: user.created_at,
    });
  });
});

app.get("/allusers", (req, res) => {
  const query = "SELECT * FROM users";  
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching users data" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }
    res.json(results);  
  });
});


app.get('/user/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
      if (err) res.status(500).json({ error: 'Error fetching user' });
      else if (results.length === 0) res.status(404).json({ error: 'User not found' });
      else res.json(results[0]);
    });
  });
  app.patch("/user", (req, res) => {
    const { userId, newUsername } = req.body;
  
    if (!userId || !newUsername) {
      return res.status(400).json({ error: "User ID and new username are required" });
    }
    const query = "UPDATE users SET username = ? WHERE id = ?";
    db.query(query, [newUsername, userId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Error updating username" });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "Username updated successfully" });
    });
  });
  

// Update Profile
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    db.query('UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?', 
      [username, email, password, id], 
      (err) => {
        if (err) res.status(500).json({ error: 'Error updating profile' });
        else res.json({ message: 'Profile updated successfully' });
      });
  });


//products

  app.get('/products', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error fetching products' });
      } else {
        res.json(results);
      }
    });
  });

  
//each product

  app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
      if (err) res.status(500).json({ error: 'Error fetching product' });
      else if (results.length === 0) res.status(404).json({ error: 'Product not found' });
      else res.json(results[0]);
    });
  });


//adding products

app.post('/products', (req, res) => {
  const { name, price, stock, category, image } = req.body;
  let description = req.body.description;  
  if (!description) {
    description = "Description";
  }
  if (!name || !description || !price || !stock || !image ) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const query = 'INSERT INTO products (name, description, price, stock, category,image) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [name, description, price, stock, category,image], (err) => {
    if (err) {
      console.error('Error adding product:', err);
      res.status(500).json({ error: 'Error adding product' });
    } else {
      res.status(201).json({ message: 'Product added successfully' });
    }
  });
});


//updating products

  app.put('/products/:id', isAdmin, (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;
    db.query('UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?', 
      [name, description, price, stock, id], 
      (err) => {
        if (err) res.status(500).json({ error: 'Error updating product' });
        else res.json({ message: 'Product updated successfully' });
      });
  });


//deleting products

app.delete('/products/:id', isAdmin, (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM products WHERE id = ?', [id], (err) => {
      if (err) res.status(500).json({ error: 'Error deleting product' });
      else res.json({ message: 'Product deleted successfully' });
    });
  });


// Place Order API
app.post('/checkout', (req, res) => {
  const { userId, cartItems, formData } = req.body;
  if (!userId || !cartItems || cartItems.length === 0 || !formData) {
    return res.status(400).json({ error: 'Invalid data provided' });
  }
  const { name, email, address, phone } = formData;
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error starting transaction' });
    }
    
    const checkoutQuery = `
      INSERT INTO checkout (user_id, name, email, address, phone_number)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(checkoutQuery, [userId, name, email, address, phone], (err, results) => {
        if (err) {
          console.error('Error executing query:', err);
          return db.rollback(() => {
            res.status(500).json({ error: 'Error inserting checkout details1' });
          });
        }   
        else{
          res.json("Order Placed Successfully..")
        }
            }
          );
        });
      }
    );
  

    app.get('/checkout', (req, res) => {
      const query = 'SELECT * FROM checkout'; 
      db.query(query, (err, results) => {
        if (err) {
          console.error('Error fetching orders:', err);
          return res.status(500).json({ error: 'Error fetching orders' });
        }
        
        res.json({ orders: results });
      });
    });

    app.post("/orders", (req, res) => {
      const { userId, productId, quantity, price } = req.body;
    
      if (!userId || !productId || !quantity || !price) {
        return res.status(400).json({ error: "Missing required fields" });
      }
    
      db.query(
        "SELECT id FROM orders WHERE user_id = ? AND status = 'pending'",
        [userId],
        (err, results) => {
          if (err) return res.status(500).json({ error: "Database error" });
    
          const orderId = results.length ? results[0].id : null;
    
          if (orderId) {
            const insertItemQuery = `
              INSERT INTO order_items (order_id, product_id, quantity, price)
              VALUES (?, ?, ?, ?)
              ON DUPLICATE KEY UPDATE quantity = quantity + ?`;
    
            db.query(
              insertItemQuery,
              [orderId, productId, quantity, price, quantity],
              (err) => {
                if (err) return res.status(500).json({ error: "Failed to add item" });
                res.json({ message: "Item added to cart successfully" });
              }
            );
          } else {
            const createOrderQuery = `
              INSERT INTO orders (user_id, total_amount, status)
              VALUES (?, ?, 'pending')`;
    
            db.query(createOrderQuery, [userId, price * quantity], (err, results) => {
              if (err) return res.status(500).json({ error: "Failed to create order" });
    
              const newOrderId = results.insertId; 
              const insertItemQuery = `
                INSERT INTO order_items (order_id, product_id, quantity, price)
                VALUES (?, ?, ?, ?)`;
    
              db.query(
                insertItemQuery,
                [newOrderId, productId, quantity, price],
                (err) => {
                  if (err) return res.status(500).json({ error: "Failed to add item to new order" });
                  res.json({ message: "New order created and item added successfully" });
                }
              );
            });
          }
        }
      );
    });
    



//orders
app.get("/orders", (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const query = `
    SELECT 
      oi.id AS item_id, p.name, p.price, oi.quantity
    FROM 
      orders o
    JOIN 
      order_items oi ON o.id = oi.order_id
    JOIN 
      products p ON oi.product_id = p.id
    WHERE 
      o.user_id = ? AND o.status = 'pending'`;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    const totalPrice = Math.round(results.reduce((total, item) => total + item.price * item.quantity, 0)*100)/100;
    res.json({ cartItems: results, totalPrice });
      });
    });


  app.delete("/orders/:itemId", (req, res) => {
    const { itemId } = req.params;
    const deleteQuery = "DELETE FROM order_items WHERE id = ?";
    db.query(deleteQuery, [itemId], (err, results) => {
      if (err) return res.status(500).json({ error: "Failed to remove item" });
      res.json({ message: "Item removed from cart successfully" });
  });
  });



const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});