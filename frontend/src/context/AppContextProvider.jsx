import { ShopContextProvider } from './ShopContext.jsx';
import { ChatProvider } from './ChatContext.jsx';

export const AppContextProvider = ({ children }) => {
    return (
        <ShopContextProvider>
            <ChatProvider>
                {children}
            </ChatProvider>
        </ShopContextProvider>
    );
};
