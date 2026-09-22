
enum CREDENTIALS {
    Email = 'hafiz@designstack.com',
    password = 'demo1234',
}

export function getLogin(email: string, pass: string): boolean { return  (email === CREDENTIALS.Email && pass === CREDENTIALS.password);}