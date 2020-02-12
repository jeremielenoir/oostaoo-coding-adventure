
export function getResultsDefinition(candidateResults){

 
  const {name, email, date, languages, duration, score, resultsByLanguage, totalPointsMax, totalPointsCandidat, questionsRapport, totalTestTime, totalCandidateTime } = candidateResults;

  let separatorString = '-';
  let separatorUnderscore = '_';

  for (let i = 0; i <52; i++) {
    separatorString += ' -';
  }

  for (let i = 0; i < 92; i++) {
    separatorUnderscore += '_'
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

  function buildLanguageTemplate(language) {
    let {percentage_techno} = resultsByLanguage[language];
    percentage_techno = parseInt(percentage_techno.split(' ')[0]);
    let scoreBar = scoreBarBuilder(percentage_techno);
    //  console.log(scoreBar, percentage_techno);
    // one template for one lanauge
    return {
      style: 'language-label',
      columns: [
        [{
          width: 40,
          text: [
            {
              text: ' ',
              style: 'font-awesome-icons',
              fontSize: 20,
              color: '#F7BB13',
            },{
              text: language
            }
          ]
        }],
        [{
          width: 50,
          text: [{
            text: scoreBar.fullBar,
            color: '#2FB994',
            style: 'font-awesome-icons',
            fontSize: 26,
            lineHeight: '',
            characterSpacing: 1,
          },{
            text: scoreBar.emptyBar,
            color: '#EEEEEE',
            style: 'font-awesome-icons',
            fontSize: 26,
            lineHeight: '',
            characterSpacing: 1,
          }]
        }], {
          width: 'auto',
          text: `${percentage_techno}%`,
          fontSize: 16
        }
      ]
    }
  }

  function buildLanguagesTemplates(resultsByLanguage) {
    return Object.keys(resultsByLanguage).map(language => {
      return buildLanguageTemplate(language);
    });
  }

  let languagesTemplates = buildLanguagesTemplates(resultsByLanguage);

  function questionDetailLayout(question, counter) {
    let {content, name, candidate_answer, correct_answer, question_max_score, question_candidate_score, question_time, question_timeRep} = question;

    function createChoiceTemplate (possibility) {
      let icon = possibility === candidate_answer ? ' ': ' ';
      let color = possibility === correct_answer ? '#2FB994' : '#000';

      return {
        text: [
          {
            text: icon,
            style: 'font-awesome-icons',
            fontSize: 16
          },
          {
            text: possibility,
            color: color,
            fontSize: 16
          }
        ]
      };
    }

    function buildQcmTemplate(content) {
      return content.map(choice => {
        return createChoiceTemplate(choice);
      });
    }

    let qcmTemplate = buildQcmTemplate(content);

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
                    text: `Question ${counter} :`,
                    style: 'question-detail-label'
                  },{
                    text: '',
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
                    text: 'Javascript  ',
                    style: 'question-detail-info'
                  },{
                    text: ' ',
                    style: 'font-awesome-icons',
                    color: '#F7BB13',
                    fontSize: 20,

                  },
                  {
                    text: `${question_timeRep} / ${question_time}  `,
                    style: 'question-detail-info',
                    lineHeight: -1.5
                  },{
                    text: ' ',
                    style: 'font-awesome-icons',
                    fontSize: 20,
                    color: '#F7BB13',
                  },{
                    text: `${question_candidate_score} / ${question_max_score} pts  `,
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
        text: name
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
        ul: qcmTemplate,
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
          text: correct_answer,
          fontSize: 8
        }],
        ]
      }, {
        text: ' ',
        style: 'blank-separator'
      }
    ]
  }

  function buildQuestionsLayout(questionsRapport) {
    // push all questions in pdf content
    let counter = 1;
    let questionsLayout = [];
    questionsRapport.map(question => {
      questionsLayout.push(...questionDetailLayout(question, counter));
      counter++;
    })
    return questionsLayout;
  }

  const questionsLayout = buildQuestionsLayout(questionsRapport);

  return {
    content : [
      {
        text: [
          {
            style: 'header-name-candidate',
            text: name,
          }, {
            style: 'header-email-candidate',
            text: ` (${email})`
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
                text: `${totalPointsCandidat} / ${totalPointsMax} pts`
              }],
              [{
                text: 'Durée',
                style: 'score-title'
              },{
                text: totalCandidateTime,
                style: 'score-figure'
              },{
                text: `/ ${totalTestTime}`
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
      },
      ...languagesTemplates,
      /*
      {
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
      }, */
      {
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
    // pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
    //   //check if signature part is completely on the last page, add pagebreak if not
    //   if (currentNode.id === 'break-end' && (currentNode.pageNumbers.length != 1 || currentNode.pageNumbers[0] != currentNode.pages)) {
    //     return true;
    //   }
    //   //check if last paragraph is entirely on a single page, add pagebreak if not
    //   else if (currentNode.id === 'closingParagraph' && currentNode.pageNumbers.length != 1) {
    //     return true;
    //   }
    //   return false;
    // },
  }
}
