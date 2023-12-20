export function checkSourceDuplicate(sources, key, path) {
    const source = sources?.filter((source)=>source.key == key)[0]?? {}
    if (!source) {
      return false
    }
    const duplicate = source.paths?.filter((p)=>path==p.path)[0]
    if (duplicate) {
      return true
    }
    return false
  }

  export function checkDestDuplicate(dests, key) {
    const destExist = dests?.filter((dest) => dest.key == key)[0]
    if (destExist) {
      return true
    }
    return false
  }


  export function checkSourceFriends(count) {
    const source = count.meta.transferDrawer?.sources?.filter((source)=>source.friend)[0]
    if (source) return true
    return false
  }

  export function checkDestFriends(count) {
    const destExist = count.meta.transferDrawer?.dests?.filter((dest) => dest.friend)[0]
    if (destExist) {
        return true
    }
    return false
  }


  export function checkSourceNonFriends(count) {
    const source = count.meta.transferDrawer?.sources?.filter((source)=> !source.friend)[0]
    if (source) return true
    return false
  }

  export function checkDestNonFriends(count) {
    const destExist = count.meta.transferDrawer?.dests?.filter((dest) => !dest.friend)[0]
    if (destExist) {
        return true
    }
    return false
  }