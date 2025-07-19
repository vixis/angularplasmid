import React, { useState } from 'react';
import FirstExample from './examples/FirstExample';
import PUC19Example from './examples/PUC19Example';

function App() {
    const [currentExample, setCurrentExample] = useState('first');

    return (
        <div className="App">
            <header style={{ padding: '20px', backgroundColor: '#f5f5f5', marginBottom: '20px' }}>
                <h1>React Plasmid Visualization</h1>
                <p>Converted from Angular to React</p>
                <div>
                    <button 
                        onClick={() => setCurrentExample('first')}
                        style={{ 
                            marginRight: '10px', 
                            padding: '10px 20px',
                            backgroundColor: currentExample === 'first' ? '#007bff' : '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        First Example (pHS1)
                    </button>
                    <button 
                        onClick={() => setCurrentExample('puc19')}
                        style={{ 
                            padding: '10px 20px',
                            backgroundColor: currentExample === 'puc19' ? '#007bff' : '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        pUC19 Example
                    </button>
                </div>
            </header>
            
            <main style={{ padding: '20px' }}>
                {currentExample === 'first' && <FirstExample />}
                {currentExample === 'puc19' && <PUC19Example />}
            </main>
        </div>
    );
}

export default App;
