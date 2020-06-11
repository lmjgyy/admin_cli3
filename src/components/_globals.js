import Vue from 'vue'
// https://webpack.js.org/guides/dependency-management/#require-context
const requireComponent = require.context(
  // Look for files in the current directory
  '.',
  // Do not look in subdirectories
  true,
  // Only include "_base-" prefixed .vue files
  /_base-[\w-]+\.vue$/
)

// For each matching file name...
requireComponent.keys().forEach((fileName) => {
  // Get the component config
  const componentConfig = requireComponent(fileName)
  // Get the PascalCase version of the component name
  const componentName = fileName
    // ./CommonTable/_base-table.vue 去父文件夹名 => _base-table.vue
    .replace(/^\.\/(.*)\//, '')
    // Split up kebabs
    .split('-')
    // Upper case
    .map((kebab) => kebab.charAt(0).toUpperCase() + kebab.slice(1))
    // Concatenated
    .join('')
    // 去_
    .slice(1)

  // Globally register the component
  console.log(componentName, componentConfig.default)
  Vue.component(componentName, componentConfig.default || componentConfig)
})
