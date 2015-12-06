export default [
  [
    (input, ctx) => { // braces
      var paramExprs = ctx.paramExprs = []
      return input.replace(/\{([^\{]*)\}/g, ($0, $1) => '#{' + (paramExprs.push($1) - 1) +'}')
    },
    (input, ctx) => {
      var {paramExprs} = ctx
      return input.map((p) => p.replace(/^#\{(\d+)\}$/,($0, $1) => '[{' + paramExprs[$1].split('.').map((i) => /^\d+$/.test(i)?'['+i+']':'["'+i+'"]').join('') + '}]')
                              //FIXME .replace(/(?=\w+)#\{(\d+)\}(?=\w+)/g,($0, $1) => '"+{' + paramExprs[$1] + '}+"')
                              .replace(/#\{(\d+)\}/g, ($0, $1) => '{' + paramExprs[$1].split('.').map((i) => /^\d+$/.test(i)?'['+i+']':'["'+i+'"]').join('') + '}'))
    }
  ],
  [
    (input, ctx) => { // predict [(...)],[?(...)]
      var predictExprs = ctx.predictExprs = []
      return input.replace(/[\['](\??\(.*?\))[\]']/g, ($0, $1) => ';##' + (predictExprs.push($1) - 1))
    },
    (input, ctx) => {
      var {predictExprs} = ctx
      return input.map((p) => p.replace(/^##(\d+)$/, ($0, $1) => predictExprs[$1]))
    }
  ],
  [
    (input, ctx) => { // dot identifer
      var identifers = ctx.identifers = []
      return input.replace(/(?:\.)([A-Z_$]+[0-9A-Z_$]*)/ig, ($0, $1) => ';###' + (identifers.push($1) - 1))
    },
    (input, ctx) => {
      var {identifers} = ctx
      return input.map((p) => p.replace(/^###(\d+)$/, ($0, $1) => '["' + identifers[$1] + '"]'))
    }
  ],
  [
    (input, ctx) => {
      return input.replace(/[\.\[]/g, ';')
    }
  ],
  [
    (input, ctx) => {
      return input.replace(/;;;|;;/g, ';..;').replace(/;$|'?\]|'$/g, '')
    }
  ],
  [
    (input, ctx) => {
      return input.split(';')
    },
    (input, ctx) => {
      return input.map((p) => p.replace(/^(\d+)$/, '[$1]'))
    }
  ]
]
