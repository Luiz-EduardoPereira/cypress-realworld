/// <reference types="cypress" />
import { pessoa } from "../support/pessoa"
const faker = require("faker-br")

describe.only('Funcionalidade - Home', () => {
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

    it.only('Validar se aparecerá artigos ao mudar para visão "Global Feed"', () => {
        cy.contains('Global Feed').click()
        cy.contains('Loading articles...').should('not.visible')
        cy.get('[ng-repeat="article in $ctrl.list"]').should('be.visible').then(($artigos) => {
            expect($artigos).to.exist
        })
    })

    it('Validar abertura de algum artigo na visão "Global Feed"', () => {
        cy.contains('Global Feed').click()
        cy.contains('Loading articles...').should('not.visible')
        cy.get('[ng-bind="$ctrl.article.title"]').last().invoke('text').then(($titulo) => {
            cy.get(".ng-isolate-scope .ng-isolate-scope .article-preview").last().click()
            cy.url().should('not.eq', 'https://demo.realworld.io/#/')
            cy.get('.ng-binding > p').should('be.visible')
            cy.get('h1.ng-binding').should('have.text', $titulo)
        })
    })

    it('Validar ação de curtir algum artigo na visão "Global Feed"', () => {
        cy.intercept('POST','**/favorite').as('Espera').then(() => {
        cy.contains('Global Feed').click()
        cy.contains('Loading articles...').should('not.visible')
            cy.get('[list-config="$ctrl.listConfig"] .ng-scope .article-preview .ng-isolate-scope .pull-xs-right .btn:eq(0)').click()
            cy.wait('@Espera')
        })
        cy.get('[list-config="$ctrl.listConfig"] .ng-scope .article-preview .ng-isolate-scope .pull-xs-right .btn:eq(0)').should('have.css', 'color', 'rgb(255, 255, 255)')
        cy.get('[list-config="$ctrl.listConfig"] .ng-scope .article-preview .ng-isolate-scope .pull-xs-right .btn:eq(0)').should('have.css', 'background-color', 'rgb(92, 184, 92)')
        cy.get('.ng-isolate-scope .ng-isolate-scope .article-preview').first().click()
        cy.get(".ng-isolate-scope .ng-isolate-scope favorite-btn span:contains('Unfavorite Article')").first().should('have.text', '\n      Unfavorite Article ')
        cy.get(".ng-isolate-scope .ng-isolate-scope favorite-btn span:contains('Unfavorite Article')").last().should('have.text', '\n      Unfavorite Article ')
    })

    it('Validar ação de descurtir algum artigo na visão "Global Feed"', () => {
        cy.intercept('DELETE','**/favorite').as('Espera').then(() => {
        cy.contains('Global Feed').click()
            cy.get('[list-config="$ctrl.listConfig"] .ng-scope .article-preview .ng-isolate-scope .pull-xs-right .btn:eq(0)').click()
            cy.wait('@Espera')
        })
        cy.get('[show-authed="true"].pull-xs-right .nav-item:contains("Home")').click()
        cy.get('[list-config="$ctrl.listConfig"] .ng-scope .article-preview .ng-isolate-scope .pull-xs-right .btn:eq(0)').should('have.css', 'color', 'rgb(92, 184, 92)')
        cy.get('[list-config="$ctrl.listConfig"] .ng-scope .article-preview .ng-isolate-scope .pull-xs-right .btn:eq(0)').should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
        cy.get('.ng-isolate-scope .ng-isolate-scope .article-preview').first().click()
        cy.get(".ng-isolate-scope .ng-isolate-scope favorite-btn span:contains('Favorite Article')").first().should('have.text', '\n      Favorite Article ')
        cy.get(".ng-isolate-scope .ng-isolate-scope favorite-btn span:contains('Favorite Article')").last().should('have.text', '\n      Favorite Article ')
    })

    it('Validar adição de comentário em um artigo na visão "Global Feed"', () => {
        cy.contains('Global Feed').click()
        cy.contains('Loading articles...').should('not.visible')
        cy.get('[ng-bind="$ctrl.article.title"]:eq(8)').click()
        cy.get('.form-control').type(`${faker.lorem.paragraph()}`)
        cy.get('.card-footer > .btn').click()
        cy.get('.ng-scope > .card > .card-block').should('be.visible')
    })

    it('Validar exclusão de comentário em um artigo na visão "Global Feed"', () => {
        cy.contains('Global Feed').click()
        cy.contains('Loading articles...').should('not.visible')
        cy.get('[ng-bind="$ctrl.article.title"]:eq(5)').click()
        cy.get('.form-control').type(`${faker.lorem.paragraph()}`)
        cy.get('.card-footer > .btn').click()
        cy.get('.ng-scope > .card > .card-block').should('be.visible')
        cy.get('.mod-options > .ion-trash-a').click()
        cy.get('.ng-scope > .card > .card-block').should('not.exist')
    })

    it('Validar ação de seguir o(a) um(a) autor(a) após abertura do artigo', () => {
        cy.contains('Global Feed').click()
        cy.contains('Loading articles...').should('not.visible')
        cy.get('[ng-bind="$ctrl.article.title"]:eq(3)').click()
        cy.get('.ng-isolate-scope .ng-isolate-scope [ng-hide="$ctrl.canModify"] follow-btn .btn').first().click()
        cy.get('.ng-isolate-scope .ng-isolate-scope [ng-hide="$ctrl.canModify"] follow-btn .btn').first().should('have.text','\n  \n   \n  Unfollow Anah Benešová\n')
        cy.get('.ng-isolate-scope .ng-isolate-scope [ng-hide="$ctrl.canModify"] follow-btn .btn').last().should('have.text','\n  \n   \n  Unfollow Anah Benešová\n')
        cy.get('.ng-isolate-scope .ng-isolate-scope [ng-hide="$ctrl.canModify"] follow-btn .btn').first().click()
        cy.get('.ng-isolate-scope .ng-isolate-scope [ng-hide="$ctrl.canModify"] follow-btn .btn').first().should('have.text','\n  \n   \n  Follow Anah Benešová\n')
        cy.get('.ng-isolate-scope .ng-isolate-scope [ng-hide="$ctrl.canModify"] follow-btn .btn').last().should('have.text','\n  \n   \n  Follow Anah Benešová\n')
        cy.get('.ng-isolate-scope .ng-isolate-scope [ng-hide="$ctrl.canModify"] follow-btn .btn').last().click()
        cy.get('.ng-isolate-scope .ng-isolate-scope [ng-hide="$ctrl.canModify"] follow-btn .btn').first().should('have.text','\n  \n   \n  Unfollow Anah Benešová\n')
        cy.get('.ng-isolate-scope .ng-isolate-scope [ng-hide="$ctrl.canModify"] follow-btn .btn').last().should('have.text','\n  \n   \n  Unfollow Anah Benešová\n')
    })

    it('Validar ação de parar de seguir o(a) um(a) autor(a) após abertura do artigo', () => {
        cy.contains('Global Feed').click()
        cy.contains('Loading articles...').should('not.visible')
        cy.get('[ng-bind="$ctrl.article.title"]:eq(4)').click()
        cy.get('.ng-isolate-scope .ng-isolate-scope [ng-hide="$ctrl.canModify"] follow-btn .btn').first().click()
        cy.get('.ng-isolate-scope .ng-isolate-scope [ng-hide="$ctrl.canModify"] follow-btn .btn').first().should('have.text','\n  \n   \n  Unfollow Anah Benešová\n')
        cy.get('.ng-isolate-scope .ng-isolate-scope [ng-hide="$ctrl.canModify"] follow-btn .btn').last().should('have.text','\n  \n   \n  Unfollow Anah Benešová\n')
        cy.get('.ng-isolate-scope .ng-isolate-scope [ng-hide="$ctrl.canModify"] follow-btn .btn').first().click()
        cy.get('.ng-isolate-scope .ng-isolate-scope [ng-hide="$ctrl.canModify"] follow-btn .btn').first().should('have.text','\n  \n   \n  Follow Anah Benešová\n')
        cy.get('.ng-isolate-scope .ng-isolate-scope [ng-hide="$ctrl.canModify"] follow-btn .btn').last().should('have.text','\n  \n   \n  Follow Anah Benešová\n')
    })

    it('Validar filtro utilizando "Popular Tags" na visão "Global Feed"', () => {
        cy.contains('Global Feed').click()
        cy.contains('Loading articles...').should('not.visible')
        cy.get(".col-md-3 .sidebar .tag-list a:contains('et')").click()
        cy.contains('Loading articles...').should('not.visible')
        cy.get('[ng-show="$ctrl.listConfig.filters.tag"] > .nav-link').should('have.text', '\n                 et\n              ')
        cy.get('.preview-link > .tag-list li').should('contain', 'et')
        
    })

    it('Validar mudança entre as páginas na visão "Global Feed"', () => {
        cy.contains('Global Feed').click()
        cy.contains('Loading articles...').should('not.visible')
        cy.get('.page-link').each(($elemento, index, $lista) => {
            cy.wrap($elemento).click()
            cy.contains('Loading articles...').should('not.visible')
            cy.get('[ng-repeat="article in $ctrl.list"]').should('be.visible')
        })
    })

    it('Validar se ao seguir um(a) autor(a) aparecerá artigos na visão "Your Feed"', () => {
        cy.contains('Global Feed').click()
        cy.contains('Loading articles...').should('not.visible')
        cy.get(".col-md-3 .sidebar .tag-list a:contains('introduction')").click()
        cy.get('[ng-bind="$ctrl.article.title"]').click()
        cy.get('.ng-isolate-scope .ng-isolate-scope [ng-hide="$ctrl.canModify"] follow-btn .btn').first().click()
        cy.get('.ng-isolate-scope .ng-isolate-scope [ng-hide="$ctrl.canModify"] follow-btn .btn').first().should('have.text','\n  \n   \n  Unfollow Gerome\n')
        cy.get('.ng-isolate-scope .ng-isolate-scope [ng-hide="$ctrl.canModify"] follow-btn .btn').last().should('have.text','\n  \n   \n  Unfollow Gerome\n')
        cy.get('[show-authed="true"].pull-xs-right .nav-item:contains("Home")').click()
        cy.contains('Loading articles...').should('not.visible')
        cy.get('[ng-repeat="article in $ctrl.list"]').should('be.visible')
        cy.get('.ng-isolate-scope .article-meta .info a').should('contain', 'Gerome')
    })

    it('Validar se ao parar de seguir um(a) autor(a) não aparecerá artigos na visão "Your Feed"', () => {
        cy.contains('Global Feed').click()
        cy.contains('Loading articles...').should('not.visible')
        cy.get(".col-md-3 .sidebar .tag-list a:contains('introduction')").click()
        cy.get('[ng-bind="$ctrl.article.title"]').click()
        cy.get('.ng-isolate-scope .ng-isolate-scope [ng-hide="$ctrl.canModify"] follow-btn .btn').first().click()
        cy.get('.ng-isolate-scope .ng-isolate-scope [ng-hide="$ctrl.canModify"] follow-btn .btn').first().should('have.text','\n  \n   \n  Unfollow Gerome\n')
        cy.get('.ng-isolate-scope .ng-isolate-scope [ng-hide="$ctrl.canModify"] follow-btn .btn').last().should('have.text','\n  \n   \n  Unfollow Gerome\n')
        cy.get('[show-authed="true"].pull-xs-right .nav-item:contains("Home")').click()
        cy.contains('Loading articles...').should('not.visible')
        cy.contains('No articles are here... yet.').should('be.visible')
        cy.get('[ng-repeat="article in $ctrl.list"]').should('not.exist')
    })

    it('Validar mudança entre as páginas na visão "Your Feed"', () => {
        cy.contains('Global Feed').click()
        cy.contains('Loading articles...').should('not.visible')
        cy.get(".col-md-3 .sidebar .tag-list a:contains('cupiditate')").click()
        cy.get('[ng-bind="$ctrl.article.title"]:eq(0)').click()
        cy.get('.ng-isolate-scope .ng-isolate-scope [ng-hide="$ctrl.canModify"] follow-btn .btn').first().click()
        cy.get('.ng-isolate-scope .ng-isolate-scope [ng-hide="$ctrl.canModify"] follow-btn .btn').first().should('have.text','\n  \n   \n  Unfollow Anah Benešová\n')
        cy.get('.ng-isolate-scope .ng-isolate-scope [ng-hide="$ctrl.canModify"] follow-btn .btn').last().should('have.text','\n  \n   \n  Unfollow Anah Benešová\n')
        cy.get('[show-authed="true"].pull-xs-right .nav-item:contains("Home")').click()
        cy.contains('Your Feed').click()
        cy.contains('Loading articles...').should('not.visible')
        cy.get('.page-link').each(($elemento, index, $lista) => {
            cy.wrap($elemento).click()
            cy.contains('Loading articles...').should('not.visible')
            cy.get('[ng-repeat="article in $ctrl.list"]').should('be.visible')
        })
    })
})