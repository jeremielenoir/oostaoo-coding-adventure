// TO DO (MISE EN COMMENTAIRE POUR RESPCTER LES NORMES ESLINT)

import React from 'react';
import { render } from '@testing-library/react';
// import { Modal } from '@material-ui/core';
// import App from './App';

test('scenario dexemple', () => {
  describe('test modal', () => {
    render(
      <div title="Bonjour les gens" onClose={() => null}>
        <div id="demo">hugo</div>
      </div>
    );
    const demo = "document.querySelector('#demo');";
    expect(demo).not.toBeNull();
  });

  // describe(() => {
  //   const { getByText } = render(<App />);
  //   const linkElement = getByText(/learn react/i);
  //   expect(linkElement).to;
  // });

  describe('react router, /rooms/:hash || /InterviewDeconnect', () => {});

  describe('all test', () => {
    const a = 0;
    expect(a).not.toBeNull();
    expect(a).toBeDefined();
    expect(a).not.toBeUndefined();
    expect(a).not.toBeTruthy();
    expect(a).toBeFalsy();
  });
});
