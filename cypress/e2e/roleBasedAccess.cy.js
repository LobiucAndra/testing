describe('Testare acces și restricții la pagina de requesturi', () => {
  it('Profesorul vizualizează requesturile, iar accesul este restricționat după logout', () => {
    cy.fixture('userData').then((user) => {
      // Pasul 1: Conectează-te cu un cont de profesor
      cy.visit('/login'); // Mergi pe pagina de login
      cy.wait(1000); // Așteaptă puțin pentru a permite încărcarea completă a paginii
      
      cy.get('input[type="email"]').type(user.profesor.email); // Introdu email-ul
      cy.wait(500); // Pauză pentru vizibilitate
      
      cy.get('input[type="password"]').type(user.profesor.password); // Introdu parola
      cy.wait(500); // Pauză pentru vizibilitate
      
      cy.get('button[type="submit"]').click(); // Apasă butonul de login
      cy.wait(1500); // Așteaptă puțin pentru a permite redirecționarea

      // Pasul 2: Logout
      cy.visit('/login'); 
      cy.wait(1000); // Așteaptă puțin înainte de verificare

      // Pasul 3: Verifică dacă utilizatorul este redirecționat la /login
      cy.url().should('include', '/login');

      // Pasul 4: Încearcă să accesezi direct pagina /view_requests
      cy.visit('/view_requests');
      cy.wait(1000); // Pauză pentru vizibilitate
      cy.url().should('include', '/login'); // Asigură-te că utilizatorul este redirecționat la login

      // Pasul 5: Conectează-te cu un cont de student
      cy.get('input[type="email"]').type(user.student.email); // Introdu email-ul studentului
      cy.wait(500); // Pauză pentru vizibilitate
      
      cy.get('input[type="password"]').type(user.student.password); // Introdu parola studentului
      cy.wait(500); // Pauză pentru vizibilitate

      cy.get('button[type="submit"]').click(); // Apasă butonul de login
      cy.wait(1500); // Așteaptă puțin pentru a permite redirecționarea

      // Verifică redirecționarea pe pagina specifică studentului
      cy.url().should('include', '/exams'); 
    });
  });
});