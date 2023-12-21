const faker = require("faker-br")
export const pessoa = {
    "usuario": {
        "email": `${faker.internet.email()}`,
        "usuario": `${faker.name.firstName()+faker.name.lastName()}`,
        "senha": `${faker.internet.password()}`
    },

    "usuarioRepetido": {
        "email": `${faker.internet.email()}`,
        "usuario": `${faker.name.firstName()+faker.name.lastName()}`,
        "senha": `${faker.internet.password()}`
    },
    "usuarioValido": {
        "email": 'luizeduardo@mozej.com',
        "usuario": 'Luiz Eduardo',
        "senha": 'Xyz123456@'
    }
}