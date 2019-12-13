
export function getResultsDefinition(candidateResults){

  const {name, email, date, languages, duration, score, resultsByLanguage, questionsRapport } = candidateResults;

  let separatorString = '-';
  let separatorUnderscrore = '_';

  for (let i = 0; i <52; i++) {
    separatorString += ' -';
  }

  for (let i = 0; i < 92; i++) {
    separatorUnderscrore += '_'
  }

  function scoreBarBuilder (scorePercentage) {
    let fullBar = '';
    let emptyBar = '';
    let fullSquareIndex = Math.round(scorePercentage/10);
    for(let i = 0; i <10; i++) {
      if (i < fullSquareIndex) {
        fullBar+='';
      } else {
        emptyBar+='';
      }
    }
    return {fullBar,emptyBar};
  }

  let scoreBar = scoreBarBuilder(100);

  function questionDetailLayout() {
    return [
      {
        // encard gris avec la question le temps, points
        id: 'break-end',
        table: {
          layout: 'detailQuestionLayout',
          headerRows: 1,
          widths: ['100%'],
          body: [
            [{
              fillColor: '#2b3035',
              border: [false, false, false, false],
              columns: [
                [{
                  margin: [10,10,10,4],
                  text: [{
                    text: 'Question 1: ',
                    style: 'question-detail-label'
                  },{
                    text: 'Option -m',
                    style: 'question-detail-data'
                  }],
                },
                {
                  margin: [10,4,10,10],
                  text: [
                  {
                    text: ' ',
                    style: 'font-awesome-icons',
                    fontSize: 20,
                    color: '#F7BB13',
                  },
                  {
                    text: 'Git  ',
                    style: 'question-detail-info'
                  },{
                    text: ' ',
                    style: 'font-awesome-icons',
                    color: '#F7BB13',
                    fontSize: 20,

                  },
                  {
                    text: '0:15 : 0:30  ',
                    style: 'question-detail-info',
                    lineHeight: -1.5
                  },{
                    text: ' ',
                    style: 'font-awesome-icons',
                    fontSize: 20,
                    color: '#F7BB13',
                  },{
                    text: '20 / 20 pts  ',
                    style: 'question-detail-info'
                  }],
                }],
              ],
              // one line first row
            }],
          ]
        }
      }, {
        // ? Question
        margin: [0,10],
        text: [{
          text: ' ',
          color: '#F7BB13',
          style: 'font-awesome-icons',
          fontSize: 22
        }, {
          text: 'Question',
          fontSize: '22',
        }],
      }, {
        text: 'Quelle option de la ligne de commande permet de spécifier un commentaire de commit à l\'exécution de git commit ?'
      }, {
        text: separatorString,
        style: 'separator-dot',
        margin: [0,10]
      }, {
        margin: [0,0,10,0],
        text: [{
          // text: '',
          text: ' ',
          style: 'font-awesome-icons',
          color: '#F7BB13',
          fontSize: 22,
        }, {
          text: 'Réponse',
          fontSize: '22',
        }],

      }, {
        markerColor: 'white',
        ul: [
          {
            text: [
              {
                text: ' ',
                style: 'font-awesome-icons',
                fontSize: 16
              },
              {
                text: '-m',
                color: '#2FB994',
                fontSize: 16
              }
            ]
          },
          {
            text: [
              {
                text: ' ',
                style: 'font-awesome-icons',
                fontSize: 16
              },
              {
                text: '-i',
                fontSize: 16
              }
            ]
          },
          {
            text: [
              {
                text: ' ',
                style: 'font-awesome-icons',
                fontSize: 16
              },
              {
                text: '-l',

                fontSize: 16
              }
            ]
          },
        ]
      }, {
        text: separatorString,
        style: 'separator-dot',
        margin: [0,10]
      },{
        text: [
          {
           text: ' ',
           style: 'font-awesome-icons',
           color: '#F7BB13'
          },
          {
            text: 'Résultat'
          }
        ],
        margin: [0,0,10,0],
        fontSize: '22',
      }, {
        columns: [
        {
          width: 16,
          text: ' ',
          fontSize: 16,
          style: 'font-awesome-icons',
          color: '#2FB994',
        },
        [{
          text: 'Réponse correcte',
        }, {
          text: 'Connaissance du langage',
          fontSize: 8
        }],
        ]
      }
    ]
  }

  let questionsLayout = [];
  for(let i = 0; i < 10; i++) {
    questionsLayout.push(...questionDetailLayout());
  }

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
        text: separatorString
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
        text: separatorString
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
          widths:['40%','50%','10%'],
          layout: 'resultTableLayout',
          body: [
            [
              {
                text: 'Connaissance du langage',
                fontSize: 12
              },
              {
                alignment:'right',
                text: [{
                  text: scoreBar.fullBar,
                  color: '#2FB994',
                  style: 'font-awesome-icons',
                  fontSize: 26,
                  lineHeight: ''
                },{
                  text: scoreBar.emptyBar,
                  color: '#EEEEEE',
                  style: 'font-awesome-icons',
                  fontSize: 26,
                  lineHeight: ''
                }]
              },
              '60%'
            ],
            // [{text: 'Fiabilité'}, '___', '60%'],
            // [{text: 'Modélisation '}, '___', '60%'],
          ]
        }
      }, {
        text: ' ',
        style: 'blank-separator',
      },

      ...questionsLayout,
      // ...questionDetailLayout(),
      // ...questionDetailLayout(),
      // ...questionDetailLayout()
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
        fontSize: 6
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
      },
      'blank-separator': {
        margin: [0,20]
      },
      'blank-separator-small': {
        margin: [0,5]
      },
      'question-detail-label': {
        fontSize: 16,
        color: '#F7BB13'
      },
      'question-detail-data': {
        fontSize: 16,
        color: 'white'
      },
      'question-detail-info': {
        fontSize: 10,
        color: 'white',
      },
      'font-awesome-icons': {
        font: 'FontAwesome'
      }
    },

    tableLayouts: {
      resultTableLayout: {
        // short report
        hLineWidth: function (i, node) {
          if (i === 0 || i === node.table.body.length) {
            return 0;
          }
          return (i === node.table.headerRows) ? 2 : 1;
        },
        vLineWidth: function (i, node) {
          return 0;
        },
        hLineColor: function (i) {
          return i === 1 ? 'black' : '#aaa';
        },
        vLineColor: function(i, node) {
            return (i === 0 || i === node.table.widths.length) ? 'white' : 'white';
        },
        border: [false,false, false, false]
      },
      detailQuestionLayout: {
        border: [false, false, false, false],
      }
    },
    pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
      //check if signature part is completely on the last page, add pagebreak if not
      if (currentNode.id === 'break-end' && (currentNode.pageNumbers.length != 1 || currentNode.pageNumbers[0] != currentNode.pages)) {
        return true;
      }
      //check if last paragraph is entirely on a single page, add pagebreak if not
      else if (currentNode.id === 'closingParagraph' && currentNode.pageNumbers.length != 1) {
        return true;
      }
      return false;
    },
  }
}
