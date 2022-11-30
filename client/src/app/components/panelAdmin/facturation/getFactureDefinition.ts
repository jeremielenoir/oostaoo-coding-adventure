
export function getFactureDefinition(facture) {

  const { id, numero_facture, statut, updated_at , montant, date } = facture;

  return {
    content : [
      {
        margin: [5, 5, 40, 5],
        columns: [
          [{
            // text: this.resume.name,
            text: 'CodingAdventure',
            style: 'brand'
          },
          {
            // text: this.resume.address
            text: '3 rue geoffroy Marie',
            style: 'name'
          },
          {
            // text: 'Email : ' + this.resume.email,
            text: 'immeuble',
            style: 'name'
          },
          {
            // text: 'Contant No : ' + this.resume.contactNo,
            text: '75009 Paris',
            style: 'name'
          },
          {
            text: 'France',
            // link: this.resume.socialProfile,
            color: 'blue',
            style: 'name'
          },
          {
            text: '+000000000',
            // link: this.resume.socialProfile,
            style: 'name'
          }],
          [{
            text: 'Facture',
            fontSize: 24,
            alignment: 'right'
          }, {
            text: 'N° de facture ' + numero_facture,
            alignment: 'right',
            margin: [1, 1, 5, 1]
          },
          {
            text: '   ',
            margin: [20, 0, 0, 0]
          }
          , {
            text: 'solde exigible',
            alignment: 'right'
          }, {
            text: '€ ' + montant,
            alignment: 'right'
          }]
        ]
      },
      {
        text: '    ',
        height: 100
        // margin: [50,5]
      },
      {
        // margin: [],
        columns: [
          [
            {
              text: 'Facturé à '
            },
            {
              text: '_OOSTAOO CONSULTING'
            },
            {
              text: '_Jérémie Lenoir à '
            },
            {
              text: '_46 rue richielieu 2 eme'
            },
            {
              text: '_75001 Paris 01'
            },
            {
              text: '_PACA France'
            },
            {
              text: '_000000000'
            }
          ],
          [
            {
              alignment: 'right',
              margin: 10,
              columns: [
                [
                  {
                    text: 'Date facture :'
                  },
                  {
                    text: 'Conditions :'
                  },
                  {
                    text: 'Date d\'échéance :'
                  },
                  {
                    text: 'Quotation Number :'
                  },
                ],
                [
                  {
                    text: date,
                  },
                  {
                    text: '_________',
                  },
                  {
                    text: '_________',
                  },
                  {
                    text: '_________',
                  },
                ]
              ]
            }
          ]
        ]
      },
      {
        text: '    ',
        height: 100
        // margin: [50,5]
      },
       {
         table: {
          // backgroundColor: 'orange',
          layout: 'factureTableLayout',
           headersRow: 1,
           widths: [ 25, '*', 'auto', 100, '*' ],
           body: [
             [{text: '#', background: 'orange'}, 'First', 'Second', 'Third', 'Four'],
             ['1',
             {
               text: 'Online - monthly growth subscription',
             }
             , 'value 2', 'value 3', 'value 4']
           ]
         }
       },
       {
         columns: [
           [],
           [
             {
               alignment: 'right',
               columns: [
                 [
                  {
                    text: 'Sous-total'
                  },
                  {
                    text: 'VAT (20%)'
                  },
                  {
                    text: 'Total',
                    fontWeight: 'bold'
                  },
                  {
                    text: 'Paiement effectué'
                  },
                  {
                    text: 'Solde exigible',
                    fontWeight: 'bold'
                  },
                 ],
                 [
                  {
                    text: '34,00'
                  },
                  {
                    text: 'S48,00'
                  },
                  {
                    text: '418,00',
                    fontWeight: 'bold'
                  },
                  {
                    text: '418,00'
                  },
                  {
                    text: montant
                  },
                 ]
               ]
             }
           ]
         ]
       }
    ],
    styles : {
          brand: {
            fontSize: 32,
            bold: true,
          },
          name: {
            fontSize: 12,
            bold: false
          }
        },
    tableLayouts: {
      factureTableLayout: {
        hLineColor: function (i) {
          return i === 1 ? '#ccc' : '#fff';
        },
      }
    }
  };
}
