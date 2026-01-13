import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import AuthProvider from './components/AuthProvider'
import { Provider } from "react-redux";
import store from './store/store.js'



// The store is already created in store.js, no need to call it as a function
console.log('store updated', store.getState());

store.subscribe(() => {
	console.log(store.getState());
})

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<BrowserRouter>
			<Provider store={store}>
				<AuthProvider>
					<App />
				</AuthProvider>
			</Provider>
		</BrowserRouter>
	</StrictMode>,
)
