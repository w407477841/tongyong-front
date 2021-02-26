const tagsView = {
    state: {
        //访问过的
        visitedViews: [],
        //缓存的
        cachedViews: []
    },
    mutations: {
        ADD_VISITED_VIEWS: (state, view) => {
            if (state.visitedViews.some(v => v.fullPath === view.fullPath)) return
            if (!view.meta.tagHidden) {
                state.visitedViews.push(Object.assign({}, view, {
                    title: view.meta.title || 'no-name'
                }))
            } else {
                if(view.meta.parentPath){
                    let routes = window.rootApp.$router.options.routes;
                    let obj;
                    routes.forEach(el => {
                        if(el.children){
                            el.children.forEach(el2=>{
                                if(el2.children){
                                    el2.children.forEach(el3=>{
                                        if(view.meta.parentPath == el3.fullPath){
                                            obj = el3;
                                        }
                                    });
                                }
                            });
                        }
                    });
                    
                    if(obj){
                        let bl =false;
                        state.visitedViews.forEach((el)=>{
                            if(el.fullPath === view.meta.parentPath){
                                bl = true;
                            }
                        });
                        if(!bl){
                            state.visitedViews.push(Object.assign({}, obj, {
                                title: obj.meta.title || 'no-name'
                            }));
                        }
                    }

                }
            }
            if (!view.meta.noCache) {
                state.cachedViews.push(view.name)
            }
        },
        DEL_VISITED_VIEWS: (state, view) => {
            for (const [i, v] of state.visitedViews.entries()) {
                if (v.fullPath === view.fullPath) {
                    state.visitedViews.splice(i, 1)
                    break
                }
            }
            for (const i of state.cachedViews) {
                if (i === view.name) {
                    const index = state.cachedViews.indexOf(i)
                    state.cachedViews.splice(index, 1)
                    break
                }
            }
        },
        DEL_OTHERS_VIEWS: (state, view) => {
            for (const [i, v] of state.visitedViews.entries()) {
                if (v.fullPath === view.fullPath) {
                    state.visitedViews = state.visitedViews.slice(i, i + 1)
                    break
                }
            }
            for (const i of state.cachedViews) {
                if (i === view.name) {
                    const index = state.cachedViews.indexOf(i)
                    state.cachedViews = state.cachedViews.slice(index, index + 1)
                    break
                }
            }
        },
        DEL_ALL_VIEWS: (state) => {
            state.visitedViews = []
            state.cachedViews = []
        }
    },
    actions: {
        addVisitedViews({
            commit
        }, view) {
            commit('ADD_VISITED_VIEWS', view)
        },
        delVisitedViews({
            commit,
            state
        }, view) {
            return new Promise((resolve) => {
                commit('DEL_VISITED_VIEWS', view)
                resolve([...state.visitedViews])
            })
        },
        delOthersViews({
            commit,
            state
        }, view) {
            return new Promise((resolve) => {
                commit('DEL_OTHERS_VIEWS', view)
                resolve([...state.visitedViews])
            })
        },
        delAllViews({
            commit,
            state
        }) {
            return new Promise((resolve) => {
                commit('DEL_ALL_VIEWS')
                resolve([...state.visitedViews])
            })
        }
    }
}

export default tagsView