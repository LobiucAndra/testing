describe('Login Functionality', () => {
    it('should log in successfully as student', () => {
      cy.fixture('userData').then((user) => {
        cy.visit('/login'); 
        cy.wait(2000);
        // Introduce email-ul și parola pentru student
        cy.get('input[type="email"]').type(user.student.email);
        cy.get('input[type="password"]').type(user.student.password);
  
        // Apasă butonul de login
        cy.contains('button', 'Login').click();
        cy.wait(2000); // Așteaptă 2 secunde
        cy.url().should('include', '/exams');
      });
    });
  
    it('should log in successfully as profesor', () => {
      cy.fixture('userData').then((user) => {
        cy.visit('/login'); // Înlocuiește cu URL-ul corect al paginii de login
  
        // Introduce email-ul și parola pentru profesor
        cy.get('input[type="email"]').type(user.profesor.email);
        cy.get('input[type="password"]').type(user.profesor.password);
  
        // Apasă butonul de login
        cy.contains('button', 'Login').click();
  
        // Verifică dacă utilizatorul este redirecționat pe dashboard
        cy.url().should('include', '/view_requests'); 
      });
    });
  
    it('should log in successfully as secretar', () => {
      cy.fixture('userData').then((user) => {
        cy.visit('/login'); // Înlocuiește cu URL-ul corect al paginii de login
  
        // Introduce email-ul și parola pentru secretar
        cy.get('input[type="email"]').type(user.secretar.email);
        cy.get('input[type="password"]').type(user.secretar.password);
  
        // Apasă butonul de login
        cy.contains('button', 'Login').click();
  
        // Verifică dacă utilizatorul este redirecționat pe dashboard
        cy.url().should('include', '/create_teachers'); 
      });
    });
  
    it('should log in successfully as sef semigrupa', () => {
      cy.fixture('userData').then((user) => {
        cy.visit('/login'); // Înlocuiește cu URL-ul corect al paginii de login
  
        // Introduce email-ul și parola pentru șeful de semigrupă
        cy.get('input[type="email"]').type(user.sef_semigrupa.email);
        cy.get('input[type="password"]').type(user.sef_semigrupa.password);
  
        // Apasă butonul de login
        cy.contains('button', 'Login').click();
  
        // Verifică dacă utilizatorul este redirecționat pe dashboard-ul șefului de semigrupă
        cy.url().should('include', '/teachers'); 
      });
    });
  });