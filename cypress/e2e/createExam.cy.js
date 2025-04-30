describe('Create Exam Request as Sef Semigrupa', () => {
    it('should log in and create a request for George Mahalu', () => {
        cy.fixture('userData').then((user) => {
            // Pasul 1: Login ca sef de semigrupa
            cy.visit('/login');
            cy.get('input[type="email"]').type(user.sef_semigrupa.email);
            cy.get('input[type="password"]').type(user.sef_semigrupa.password);
            cy.contains('button', 'Login').click();
            cy.url().should('include', '/teachers');

            // Pasul 2: Găsește cardul pentru "George Mahalu"
            cy.contains('div.v-card-title', 'Mahalu George')
                .should('be.visible')
                .parents('div.v-card')
                .find('span')
                .contains('Create request')
                .click();

            // Pasul 3: Selectează data din calendar
            cy.get('.v-date-picker-month__day')
                .contains('20') // Găsește ziua 20
                .click();

            // Pasul 4: Selectează subiectul din dropdown
            cy.get('.v-select')  // Deschide dropdown-ul v-select pentru materie
                .click();

            // Așteaptă ca lista de subiecte să fie vizibilă
            cy.get('.v-list-item').should('be.visible');

            // Selectează un subiect din dropdown
            cy.get('.v-list-item')
                //.contains('Metode numerice')
                .contains('Grafica asistata de calculator') // Înlocuiește cu subiectul dorit
                .click();

            // Așteaptă ca dropdown-ul să se închidă și să se aplice selecția
            cy.get('.v-select').should('have.class', 'v-select--single');

            // Verifică dacă ID-ul corect este setat în v-select
            cy.get('.v-select input')
                //.should('have.attr', 'value', 'b75ec563-f7ad-4f8d-8809-fadf11ad56e8');
                .should('have.attr', 'value', '117a956a-9eb6-4ecd-9e40-2b0c588d026f'); // Verifică ID-ul, nu textul

            // Pasul 5: Apasă butonul de submit pentru a trimite cererea
            cy.get('span.v-btn__content') // Selectează butonul folosind clasa v-btn__content
                .contains('Submit') 
                .click();

            cy.wait(2000); 
            // Pasul 6: Logare ca profesor
            cy.visit('/login'); // Se navighează înapoi la pagina de login
            cy.get('input[type="email"]').type(user.profesor.email); // Introduce email-ul pentru profesor
            cy.get('input[type="password"]').type(user.profesor.password); // Introduce parola pentru profesor
            cy.contains('button', 'Login').click(); // Apasă butonul de login

            // Verifică dacă utilizatorul este redirecționat pe pagina corectă pentru profesor
            cy.url().should('include', 'view_requests'); 
        });
    });
});