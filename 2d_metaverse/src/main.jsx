import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import playerStore from './redux/playerstore.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.jsx'
import { PersistGate } from 'redux-persist/integration/react'
import { persister } from './redux/store.jsx'
createRoot(document.getElementById('root')).render(
  <>
    <PersistGate loading={null} persistor={persister}>
          <Provider store = {store}>
            <App />
          </Provider>
    </PersistGate>
  </>,
)
