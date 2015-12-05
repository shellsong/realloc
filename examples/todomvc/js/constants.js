export const visibilityFilters = {
  all:() => true,
  active:(todo) => !todo.completed,
  completed:(todo) => todo.completed
}
