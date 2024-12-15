<template>
    <div ref="draggableContainer" class="draggable-container" @mousedown="dragMouseDown">
      <header>
        <slot name="header">Random Activity</slot>
        <i class="bi bi-x-circle"></i>
      </header>
      <slot name="body">{{ label }}</slot>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DraggableDiv',
    data: function () {
      return {
        positions: {
          clientX: undefined,
          clientY: undefined,
          movementX: 0,
          movementY: 0
        }
      }
    },
    props: ['label'],
    methods: {
      dragMouseDown: function (event) {
        if(event.target.nodeName != "SELECT"){
          event.preventDefault()
          // get the mouse cursor position at startup:
          this.positions.clientX = event.clientX
          this.positions.clientY = event.clientY
          document.onmousemove = this.elementDrag
          document.onmouseup = this.closeDragElement
        }
      },
      elementDrag: function (event) {
          event.preventDefault()
          this.positions.movementX = this.positions.clientX - event.clientX
          this.positions.movementY = this.positions.clientY - event.clientY
          this.positions.clientX = event.clientX
          this.positions.clientY = event.clientY
          // set the element's new position:
          this.$refs.draggableContainer.style.top = (this.$refs.draggableContainer.offsetTop - this.positions.movementY) + 'px'
          this.$refs.draggableContainer.style.left = (this.$refs.draggableContainer.offsetLeft - this.positions.movementX) + 'px'
      },
      closeDragElement () {
        document.onmouseup = null
        document.onmousemove = null
      }
    }
  }
  </script>
  
  <style>
  .draggable-container {
    position: absolute;
    width: 150px;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: var(--tt-light);
    color: var(--tt-dark);
    border: 2px solid var(--tt-dark);
    border-radius: 5px;
    text-align: center;
    z-index: 1;
  }
  </style>