<template>
        <svg id="svg">
        </svg>
</template>
  
<script>
    import { gsap } from 'gsap';
    import { Draggable } from "gsap/Draggable";
    import { useLinesStore } from "@/stores/store.js"

    export default {
        
        mounted() {
            const lines = useLinesStore()
            gsap.registerPlugin(Draggable);
            // Amount to offset control points
            let bezierWeight = -0.675;

            const createHandle = (() => {
                let newHandle = document.createElementNS("http://www.w3.org/2000/svg", 'handle');
                newHandle.setAttribute("cx", 0)
                newHandle.setAttribute("cy", 0)
                newHandle.setAttribute("r", 8)
                newHandle.classList.add("handle")
                return newHandle
            })
            const createPath = (() => {
                let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path'); //Create a path in SVG's namespace
                newElement.setAttribute("stroke","var(--tt)")
                newElement.setAttribute("stroke-width","6")
                newElement.setAttribute("stroke-dasharray","10,10")
                newElement.setAttribute("fill","none")
                return newElement
            })

            lines.$subscribe(() => {
                //let path = document.querySelector(".path");
                var pathLayer = document.querySelector("#svg");
                pathLayer.replaceChildren();
                for (let i = 0; i < lines.lines.length; i++) {
                    pathLayer.appendChild(createHandle())
                    pathLayer.appendChild(createHandle())
                    let newElement = createPath()
                    pathLayer.appendChild(newElement);
                    let handles = document.querySelectorAll(".handle");
                    let handleI = i * 2

                    gsap.set(handles[handleI], {x: lines.lines[[i]].x1, y: lines.lines[[i]].y1});
                    gsap.set(handles[handleI + 1], {x: lines.lines[[i]].x2, y: lines.lines[[i]].y2});
                    
                    Draggable.create(handles, {
                        onDrag: updatePath,
                        bounds: ".circle-container"
                    });

                    let handlePropsA = gsap.getProperty(handles[handleI]);
                    let handlePropsB = gsap.getProperty(handles[handleI+1]);

                    updatePath(handlePropsA, handlePropsB);

                    function updatePath() {
                        let x1 = handlePropsA("x");
                        let y1 = handlePropsA("y");
                        
                        let x4 = handlePropsB("x");
                        let y4 = handlePropsB("y");
                        
                        let dx = Math.abs(x4 - x1) * bezierWeight;
                        
                        let x2 = x1 - dx;
                        let x3 = x4 + dx;
                        
                        let data = `M${x1} ${y1} C ${x2} ${y1} ${x3} ${y4} ${x4} ${y4}`;
                        newElement.setAttribute("d", data);
                    
                    }
                    
                    
                }
            })
            
        }
    };
</script>

<style scoped>
#svg {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.handle {
  fill: var(--tt);
}

path {
  fill: none;
  stroke:  var(--tt);
  stroke-dasharray: 10,10;
  stroke-width: 6;
}
</style>