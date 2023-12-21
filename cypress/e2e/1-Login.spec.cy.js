/// <reference types="cypress" />
import { pessoa } from "../support/pessoa"

describe('Funcionalidade - Login', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.get("[ui-sref='app.login']").click()
        cy.get('.text-xs-center.ng-binding').should('have.text', 'Sign in')
    })
    
    it('Validar campos obrigatórios', () => {
        cy.get("[placeholder='Email']").type(pessoa.usuario.email)
        cy.get('.btn').click()
        cy.get('div.ng-scope > .ng-binding').should('have.text', "\n      password can't be blank\n    ")
        cy.get("[placeholder='Email']").clear()
        cy.get("[placeholder='Password']").type(pessoa.usuario.senha)
        cy.get('.btn').click()
        cy.get('div.ng-scope > .ng-binding').should('have.text', "\n      email can't be blank\n    ")

    })

    it('Tentar realizar login com usuário inválido', () => {
        cy.get("[placeholder='Email']").type(pessoa.usuario.email)
        cy.get("[placeholder='Password']").type(pessoa.usuario.senha)
        cy.get('.btn').click()
        cy.get('div.ng-scope > .ng-binding').should('have.text', "\n      email or password is invalid\n    ")
    })

    it('Tentar realizar login com senha inválida', () => {
        cy.get("[placeholder='Email']").type(pessoa.usuarioValido.email)
        cy.get("[placeholder='Password']").type(pessoa.usuario.senha)
        cy.get('.btn').click()
        cy.get('div.ng-scope > .ng-binding').should('have.text', "\n      email or password is invalid\n    ")

    })

    it('Realizar login com usuário válido', () => {
        cy.get("[placeholder='Email']").type(pessoa.usuarioValido.email)
        cy.get("[placeholder='Password']").type(pessoa.usuarioValido.senha)
        cy.get('.btn').click()
        cy.contains('Global Feed').should('be.visible')
        cy.get('.navbar-light .pull-xs-right li a[ui-sref="app.profile.main({ username: $ctrl.currentUser.username })"]').should('contain', pessoa.usuarioValido.usuario)
    })
    
})