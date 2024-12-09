import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const ToolbarDemo = () => {
  const [deltas, setDeltas] = useState([]); // Store deltas
  const [productId, setProductId] = useState(null); // Track selected product ID
  const [products, setProducts] = useState([]); // List of all products
  const editorRef = useRef(null); // Reference to the contenteditable div

  // Fetch all products on load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5231/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Error fetching products!');
    }
  };

  // Clear editor and reset for new product
  const addNewProduct = () => {
    setProductId(null); // Reset the current product ID
    setDeltas([]); // Clear deltas
    editorRef.current.innerHTML = ''; // Clear the editor
  };

  // Apply styles to selected text
  const applyStyle = (style) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString(); // Extract selected text

      if (!selectedText) return; // If no text selected, exit

      // Add delta without range
      const newDelta = {
        insert: selectedText,
        attributes: { ...style }, // Add the style attributes
      };

      setDeltas((prevDeltas) => [...prevDeltas, newDelta]);

      // Apply style visually in the editor
      const span = document.createElement('span');
      Object.assign(span.style, style);
      span.textContent = selectedText;

      range.deleteContents(); // Remove the selected text
      range.insertNode(span); // Insert the styled span
    }
  };

  // Save or update content
  const saveContent = async () => {
    const payload = {
      name: 'Demo Product', // Static name
      nameDelta: JSON.stringify(deltas), // Send deltas as JSON
      price: 10.0, // Static price
    };

    try {
      if (productId) {
        // Update existing product
        await axios.put(
          `http://localhost:5231/api/products/${productId}`,
          payload
        );
        alert('Content updated successfully!');
      } else {
        // Create new product
        const response = await axios.post(
          'http://localhost:5231/api/products',
          payload
        );
        setProductId(response.data.id); // Save the ID of the new product
        alert('Content saved successfully!');
      }
      fetchProducts(); // Refresh the list of products
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Error saving content!');
    }
  };

  // Fetch and load a product's content by ID
  const fetchContent = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5231/api/products/${id}`
      );
      const { nameDelta } = response.data;
      setProductId(id); // Set the current product ID

      if (!nameDelta) throw new Error('No deltas found.');

      const parsedDeltas = JSON.parse(nameDelta);
      setDeltas(parsedDeltas); // Set the deltas for this product

      // Render deltas into the editor
      const renderedContent = parsedDeltas
        .map((delta) => {
          const style = Object.entries(delta.attributes || {})
            .map(([key, value]) => {
              // Explicitly handle fontWeight, fontStyle, etc.
              if (key === 'fontWeight') return `font-weight: ${value};`;
              if (key === 'fontStyle') return `font-style: ${value};`;
              if (key === 'textDecoration') return `text-decoration: ${value};`;
              if (key === 'color') return `color: ${value};`;
              if (key === 'fontSize') return `font-size: ${value};`;
              return `${key}: ${value};`; // Fallback for unknown attributes
            })
            .join(' ');

          return `<span style="${style}">${delta.insert}</span>`;
        })
        .join('');

      editorRef.current.innerHTML = renderedContent;
    } catch (error) {
      console.error('Error fetching content:', error);
      alert(`Error fetching content: ${error.message}`);
    }
  };

  // Delete a product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5231/api/products/${id}`);
      alert('Product deleted successfully!');
      fetchProducts(); // Refresh the list of products
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product!');
    }
  };

  return (
    <div>
      <h1>Toolbar Demo</h1>

      {/* Product List */}
      <div>
        <h2>Products</h2>
        <button onClick={addNewProduct} style={{ marginBottom: '10px' }}>
          Add New Product
        </button>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} - ${product.price.toFixed(2)}
              <button onClick={() => fetchContent(product.id)}>Edit</button>
              <button onClick={() => deleteProduct(product.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <button onClick={() => applyStyle({ fontWeight: 'bold' })}>Bold</button>
        <button onClick={() => applyStyle({ fontStyle: 'italic' })}>
          Italic
        </button>
        <button onClick={() => applyStyle({ textDecoration: 'underline' })}>
          Underline
        </button>
        <button onClick={() => applyStyle({ color: 'red' })}>Red</button>
        <button onClick={() => applyStyle({ color: 'blue' })}>Blue</button>
        <button onClick={() => applyStyle({ fontSize: '24px' })}>
          Large Font
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          minHeight: '200px',
          marginBottom: '10px',
        }}
      ></div>

      {/* Actions */}
      <button onClick={saveContent}>{productId ? 'Update' : 'Save'}</button>
    </div>
  );
};

export default ToolbarDemo;
