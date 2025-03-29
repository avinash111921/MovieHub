import { AuthContextProvider } from './AuthContext';
import { ChatProvider } from './ChatContext';

export const AppContextProvider = ({ children }) => {
    return (
        <AuthContextProvider>
            <ChatProvider>
                {children}
            </ChatProvider>
        </AuthContextProvider>
    );
};

export default AppContextProvider;
