/// <reference types="cypress" />
import { pessoa } from "../support/pessoa"
const faker = require("faker-br")

describe('Funcionalidade - Perfil', () => {
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

    it('Validar se aparecerá artigos ao clicar no perfil de um(a) autor(a) na visão "Global Feed"', () => {
        cy.contains('Global Feed').click()
        cy.contains('Loading articles...').should('not.visible')
        cy.get(".col-md-3 .sidebar .tag-list a:contains('qui')").first().click()
        cy.contains('Loading articles...').should('not.visible')
        cy.get(".col-md-9 .ng-isolate-scope .ng-scope .article-preview .ng-isolate-scope .info .author:contains('Guy Weiß')").first().click()
        cy.get('h4.ng-binding').should('have.text', 'Guy Weiß')
        cy.contains('My Articles').click()
        cy.contains('Loading articles...').should('not.visible')
        cy.get('.article-preview').should('be.visible')
    })

    it('Validar se ao favoritar artigos e ao clicar no meu perfil mostrará os meus artigos favoritados', () => {
        cy.intercept('POST','**/favorite').as('Espera').then(() => {
            cy.contains('Global Feed').click()
            cy.contains('Loading articles...').should('not.visible')
                cy.get('[list-config="$ctrl.listConfig"] .ng-scope .article-preview .ng-isolate-scope .pull-xs-right .btn:eq(0)').click()
                cy.wait('@Espera')
        })
        cy.get('.navbar-light .pull-xs-right li a[ui-sref="app.profile.main({ username: $ctrl.currentUser.username })"]').click()
        cy.get('h4.ng-binding').should('have.text', pessoa.usuarioValido.usuario)
        cy.contains('Loading articles...').should('not.visible')
        cy.contains('Favorited Articles').click()
        cy.contains('Loading articles...').should('not.visible')
        cy.get('[list-config="$ctrl.listConfig"] .ng-scope .article-preview .ng-isolate-scope .pull-xs-right .btn:eq(0)').should('have.css', 'color', 'rgb(255, 255, 255)')
        cy.get('[list-config="$ctrl.listConfig"] .ng-scope .article-preview .ng-isolate-scope .pull-xs-right .btn:eq(0)').should('have.css', 'background-color', 'rgb(92, 184, 92)')  
    })

    it('Validar que se ao desfavoritar artigos e ao clicar no meu perfil não mostrará nenhum artigo', () => {
        cy.intercept('DELETE','**/favorite').as('Espera').then(() => {
            cy.contains('Global Feed').click()
            cy.contains('Loading articles...').should('not.visible')
                cy.get('[list-config="$ctrl.listConfig"] .ng-scope .article-preview .ng-isolate-scope .pull-xs-right .btn:eq(0)').click()
                cy.wait('@Espera')
        })
        cy.get('.navbar-light .pull-xs-right li a[ui-sref="app.profile.main({ username: $ctrl.currentUser.username })"]').click()
        cy.get('h4.ng-binding').should('have.text', pessoa.usuarioValido.usuario)
        cy.contains('Loading articles...').should('not.visible')
        cy.contains('Favorited Articles').click()
        cy.contains('Loading articles...').should('not.visible')
        cy.get('[list-config="$ctrl.listConfig"] [ng-show="!$ctrl.loading && !$ctrl.list.length"]').should('contain', 'No articles are here... yet.')
        cy.get('article-preview.ng-scope > .article-preview').should('not.exist')
    })
})