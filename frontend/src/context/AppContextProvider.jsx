import { Provider } from 'react-redux';
import { store } from '../store/store';

export const AppContextProvider = ({ children }) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
};
