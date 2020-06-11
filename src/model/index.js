function inherit(Child, Parent) {
  var F = function() {}
  F.prototype = Parent.prototype
  Child.prototype = new F()
  Child.prototype.constructor = Child
}
function Model(props) {
  this.data = props.data || []
  this.loading = props.loading || false
  this.headerCls = props.headerCls || ''
}
export default {
  inherit,
  Model
}
