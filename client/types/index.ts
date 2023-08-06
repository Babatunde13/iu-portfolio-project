interface Password {
    _id: string;
    user: string;
    account_name: string;
    category: string;
    website: string;
    username: string;
    password: string;
    image: string;
    createdAt: string;
}

interface Category {
    _id: string;
    name: string;
}

interface APIResponse {
    success: boolean;
    message: string;
}

interface User {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface Token {
    token: string;
    expires: string;
}

interface Tokens {
    access: Token;
    refresh: Token;
}

interface RegisterData {
    name: string;
    email: string;
    username: string;
    password: string;
}

interface LoginData {
    email: string;
    password: string;
}

interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        tokens: Tokens;
    }
}

interface GetCategoriesResponse {
    success: boolean;
    message: string;
    data: {
        data: Category[];
    }
}

interface GetPasswordsResponse {
    success: boolean;
    message: string;
    data: {
        data: Password[];
    }
}
