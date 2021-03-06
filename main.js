// ローカルストレージAPI
// https://jp.vuejs.org/v2/examples/todomvc.html
var STORAGE_KEY = 'todos-vuejs-demo'
var todoStorage = {
  fetch: function() {
    var todos = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )
    todos.forEach(function(todo, index) {
      todo.id = index + 1
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

// インスタンスを生成
const app = new Vue({
  el: '#app',
  data: {
    todos: [],
    options: [
      { value: -1, label: 'すべて' },
      { value: 0, label: '作業中' },
      { value: 1, label: '完了' }
    ],
    // 初期値
    current: -1
  },
  computed: {
    computedTodos: function() {
      // 配列.filter(コールバック関数) => コールバック関数に合格した配列を生成して返す
      return this.todos.filter(function(element) {
        return this.current < 0 ? true : this.current === element.state
      }, this)
    },
    labels: function() {
      // 配列.reduce(コールバック関数, [初期値]) => 各要素を左から右に処理して単一の値を生成する
      return this.options.reduce(function(a, b) {
        // Object.assign(target, ...source) => sourceを参照して、targetに値をコピーまたマージする
        return Object.assign(a, { [b.value] : b.label })
      }, {})
    }
  },
  watch: {
    todos: {
      handler: function(todos) {
        // saveメソッドで保存
        todoStorage.save(todos)
      },
      // ネストしたオブジェクトも監視する
      deep: true
    }
  },
  created: function() {
    // fetchメソッドで取得
    this.todos = todoStorage.fetch()
  },
  methods: {
    doAdd: function(event, value) {
      let comment = this.$refs.comment
      if (!comment.value.length) {
        return
      }
      this.todos.push({
        id: todoStorage.uid++,
        comment: comment.value,
        state: 0
      })
      comment.value = ''
    },
    doChangeState: function(item) {
      item.state = item.state ? 0 : 1
    },
    doRemove: function(item) {
      // 文字列.indexOf('文字列') => 文字列からある文字列を検索する
      let index = this.todos.indexOf(item)
      console.log(index) // => 指定位置のインデックス番号を返す
      // 配列.splice(指定位置, 取り出す数) => 配列から要素の一部を置き換える
      this.todos.splice(index, 1)
    }
  }
})
