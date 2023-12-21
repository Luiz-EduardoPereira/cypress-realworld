/// <reference types="cypress" />
import { pessoa } from '../support/pessoa.js'

describe('Funcionalidade - Cadastro', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.get(".container .nav .nav-item:contains('Sign up')").click()
        cy.url().should('include', '/register')
    })

    it('Validar os campos obrigatórios para realização do cadastro', () => {
        cy.get('.btn').click()
        cy.get('.error-messages .ng-binding').should('have.text', "\n      email can't be blank\n    ")
        cy.get(".form-group input[placeholder='Email']").type('email@email.com')
        cy.get('.btn').click()
        cy.get('.error-messages .ng-binding').should('have.text', "\n      username can't be blank\n    ")
        cy.get(".form-group input[placeholder='Username']").type('Usuário')
        cy.get('.btn').click()
        cy.get('.error-messages .ng-binding').should('have.text', "\n      password can't be blank\n    ")
    })

    it('Realizar cadastro', () => {
        cy.get(".form-group input[placeholder='Email']").type(pessoa.usuario.email)
        cy.get(".form-group input[placeholder='Username']").type(pessoa.usuario.usuario)
        cy.get(".form-group input[placeholder='Password']").type(pessoa.usuario.senha)
        cy.intercept('POST', 'https://api.realworld.io/api/users').as('CriandoUsuario').then(() => {
            cy.get('.btn').click()
            cy.wait('@CriandoUsuario')
        })
        cy.get(".feed-toggle .nav a:contains(Your Feed)").should('be.visible')
        cy.get('.navbar-light .pull-xs-right li a[ui-sref="app.profile.main({ username: $ctrl.currentUser.username })"]').should('contain', pessoa.usuario.usuario)
    })

    it('Tentar cadastrar um mesma conta mais de uma vez', () => {
        cy.get(".form-group input[placeholder='Email']").type(pessoa.usuarioRepetido.email)
        cy.get(".form-group input[placeholder='Username']").type(pessoa.usuarioRepetido.usuario)
        cy.get(".form-group input[placeholder='Password']").type(pessoa.usuarioRepetido.senha)
        cy.intercept('POST', 'https://api.realworld.io/api/users').as('CriandoUsuario').then(() => {
            cy.get('.btn').click()
            cy.wait('@CriandoUsuario')
        })
        cy.get(".feed-toggle .nav a:contains(Your Feed)").should('be.visible')
        cy.get(".ng-scope .navbar .container .pull-xs-right .nav-item:contains('Settings')").click()
        cy.url().should('include', '/settings')
        cy.get('.btn-outline-danger').click()
        cy.get(".ng-scope .navbar .container .pull-xs-right .nav-item:contains('Sign up')").click()
        cy.url().should('include', '/register')
        cy.get(".form-group input[placeholder='Email']").type(pessoa.usuarioRepetido.email)
        cy.get(".form-group input[placeholder='Username']").type(pessoa.usuarioRepetido.usuario)
        cy.get(".form-group input[placeholder='Password']").type(pessoa.usuarioRepetido.senha)
        cy.get('.btn').click()
        cy.get('.ng-isolate-scope .error-messages .ng-scope .ng-binding').first().invoke('text').should('eq', "\n      email has already been taken\n    ")
        cy.get('.ng-isolate-scope .error-messages .ng-scope .ng-binding').last().invoke('text').should('eq', "\n      username has already been taken\n    ")
    })
})