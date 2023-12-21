/// <reference types="cypress" />
import { pessoa } from "../support/pessoa"
const faker = require("faker-br")

describe('Funcionalidade - Home', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.get("[ui-sref='app.login']").click()
        cy.get('.text-xs-center.ng-binding').should('have.text', 'Sign in')
        cy.get("[placeholder='Email']").type(pessoa.usuarioValido.email)
        cy.get("[placeholder='Password']").type(pessoa.usuarioValido.senha)
        cy.get('.btn').click()
        cy.contains('Global Feed').should('be.visible')
        cy.get('.navbar-light .pull-xs-right li a[ui-sref="app.profile.main({ username: $ctrl.currentUser.username })"]').should('contain', pessoa.usuarioValido.usuario)
        cy.url().should('eq', 'https://demo.realworld.io/#/')
        cy.contains('Loading articles...').should('not.visible')
    
    })
    
    it('Validar a tentativa de criação de um artigo sem informar os campos obrigatórios', () => {
        cy.get('.pull-xs-right li [href="#/editor/"]').click()
        cy.url().should('include', 'editor/')
        cy.get('.btn').click()
        cy.get('.error-messages .ng-binding').should('have.text', "\n      title can't be blank\n    ")
        cy.get('[placeholder="Article Title"]').type(faker.lorem.word())
        cy.get('.btn').click()
        cy.get('.error-messages .ng-binding').should('have.text', "\n      description can't be blank\n    ")
        cy.get('.btn').click()
        cy.wait(1000)
        cy.get('[ng-model="$ctrl.article.description"]').type(faker.lorem.word())
        cy.get('.btn').click()
        cy.get('.error-messages .ng-binding').should('have.text', "\n      body can't be blank\n    ")
    })
    
    it('Validar a criação de um artigo', () => {
        cy.get('.pull-xs-right li [href="#/editor/"]').click()
        cy.url().should('include', 'editor/')
        cy.get('[placeholder="Article Title"]').type(faker.lorem.word())
        cy.get('[ng-model="$ctrl.article.description"]').type(faker.lorem.word())
        cy.get('[ng-model="$ctrl.article.body"]').type(faker.lorem.paragraph())
        cy.get('.btn').click()
        cy.get('[ng-show="$ctrl.canModify"]').should('be.visible')
    })
    
    it('Validar criação do artigo em "My Articles"', () => {
        cy.get('[ui-sref="app.profile.main({ username: $ctrl.currentUser.username })"]').click()
        cy.get('.nav-link:contains(My Articles)').should('be.visible')
        cy.get('[list-config="$ctrl.listConfig"]').should('be.visible')
    })

    /*it('Editar artigo', () => {

    })*/

    /*it('Excluir artigo', () => {

    })*/

})