/// <reference types="cypress" />

describe('Funcionalidade - Configurações', () => {
    beforeEach(() => {
        cy.request({
            url: 'https://api.realworld.io/api/users/login',
            method: 'POST',
            body: {
                    "user": {
                        "email": "luizeduardo@mozej.com",
                        "password": "Xyz123456@"
                    }
            }
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.user.token).to.exist
            window.localStorage.setItem('jwtToken', response.body.user.token)
        })
        cy.visit('/settings')
    })

    it('Validar que estou caindo na tela de Configuração autenticando via API', () => {
        cy.get('.text-xs-center').should('have.text', 'Your Settings')
    })

    it('Deslogar da aplicação', () => {
        cy.contains('Or click here to logout.').click()
        cy.url().should('eq', 'https://demo.realworld.io/#/')
    })
})
