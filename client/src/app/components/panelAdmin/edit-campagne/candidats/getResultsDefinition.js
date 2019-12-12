export function getResultsDefinition(candidat){

  const {name, email, date, languages, duration, score } = candidat;

  return {
    content : [
      {
        text: [
          {
            style: 'header-name-candidate',
            text: name,
          }, {
            style: 'header-email-candidate',
            text: `(${email})`
          }
        ]
      },
      {
        margin: [0,16],
        style: 'separator-dot',
        text: `- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - `
      },
      {
        columns: [
          {
            text: [
              {
                text: 'Langages de programmation : ',
                style: 'text-info-label'
              },
              {
                text: languages,
                style: 'text-info-data'
              }
            ],
          },
          {
            text: [
              {
                style: 'text-info-label',
                text: 'Langue: '
              },
              {
                style: 'text-info-data',
                text: 'Français'
              }
            ],
          },
          {
            text: [
              {
                text: 'Date: ',
                style: 'text-info-label'
              },
              {
                text: date,
                style: 'text-info-data'
              }
            ]
          },
        ]
      },
      {
        style: 'separator',
        margin: [0, 16],
        text: '___________________________________________________________________________________________'
      },
      {
        columns : [
          [{
            columns: [
              [{
                text: 'score',
                style: 'score-title'
              },{
                text: score,
                style: 'score-figure'
              },{
                text: '1080/2180 pts'
              }],
              [{
                text: 'Durée',
                style: 'score-title'
              },{
                text: duration,
                style: 'score-figure'
              },{
                text: '/ 1 h 28'
              }],
            ]
          }
          ],
          {
            text: ' '
          },
        ]
      },{
        style: 'separator-dot',
        margin: [0,20],
        text: `- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - `
      }, {
        style: 'language-label',
        columns: [
          [{
            text: 'Git'
          }],
          [{
            text: 'barre'
          }]
        ]
      }, {
        style: 'language-detail',
        // columns: [
        //   [{
        //     text: 'Connaissance du langage'
        //   }],
        //   [{
        //     text: '70%'
        //   }]
        // ]
        table: {
          headerRows: 1,
          widths:['50%','30%','20%'],
          layout: 'resultTableLayout',
          body: [
            [{text: 'Connaissance du langage'}, '___', '60%'],
            [{text: 'Fiabilité'}, '___', '60%'],
            [{text: 'Modélisation '}, '___', '60%'],
          ]
        }
      }
    ],
    styles: {
      'header-name-candidate': {
        fontSize: 20,
        bold: true
      },
      'header-email-candidate': {
        fontSize: 18,
        bold: false
      },
      'score-figure': {
        fontSize: 32,
        color: "#F7BB13",
        bold: true
      },
      'score-title':  {
        color: "#C59FA8",
        fontSize: 12
      },
      separator: {
        color: '#D8D8D8'
      },
      'separator-dot': {
        color: '#D8D8D8',
        fontSize: 8
      },
      'text-info-label': {
        color: '#F5C026',
        fontSize: 8
      },
      'text-info-data': {
        color: '#000',
        fontSize: 8
      },
      'language-label': {
        fontSize: 20
      },
      'language-detail': {
        borderSize: 2,
        fontSize: 16
        // padding: 15,
        // border: '1px solid #ccc'
      }
    },

    tableLayouts: {
      resultTableLayout: {
        hLineColor: function(i, node) {
          return (i === 0 || i === node.table.body.length) ? 'red' : '';
        },
        vLineColor: function(i, node) {
            return (i === 0 || i === node.table.widths.length) ? 'red' : '';
        },
      }
    }
  }
}
