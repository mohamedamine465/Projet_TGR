// Ce délai sera ajouté après chaque commande (en ms)
const COMMAND_DELAY = 900; 

// Liste des commandes qu'on souhaite ralentir
const commands = ['visit', 'click', 'trigger', 'type', 'clear', 'reload'];

for (const command of commands) {
  Cypress.Commands.overwrite(command, (originalFn, ...args) => {
    const origVal = originalFn(...args);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(origVal);
      }, COMMAND_DELAY);
    });
  });
}
