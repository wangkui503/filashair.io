const xid = require('xid-js');
import toast from "react-hot-toast";


  export function uploadSpecData(source, dest) {
    return {
      host: source?.host,
      id: "xfer_" + xid.next(),
      spec: {
        settings: {
          insecure_server: true,          
          //max_rate: "200m"
        },
        action:"upload",
        remote_address: dest.xfer_addr,

        source: {
          mount_id: source?.mount_id,
          mount_alias: source?.mount_alias,
          share: source?.share,
          share_kind: source?.share_kind,
          share_alias: source?.share_alias,
          token: source?.token?? "",
          paths : source?.paths?.map((item) => (item.path)),
          path_pairs: source?.path_pairs,
        },
        dest: {
          mount_id: dest?.mount_id,
          mount_alias: source?.mount_alias,
          share: dest?.share,
          share_kind: dest?.share_kind,
          share_alias: source?.share_alias,
          token: dest.token?? "",
          path: dest?.path,
        }
    }}
  }

  export function downloadSpecData(source, dest) {
    return {
      host: dest?.host,
      id: "xfer_" + xid.next(),
      spec: {
        settings: {
          insecure_server: true,          
          //max_rate: "300m"
        },
        action:"download",
        remote_address: source.xfer_addr,

        source: {
          mount_id: source?.mount_id,
          mount_alias: source?.mount_alias,
          share: source?.share,
          share_kind: source?.share_kind,
          share_alias: source?.share_alias,
          token: source?.token?? "",
          paths : source?.paths.map((item) => (item.path)),
        },
        dest: {
          mount_id: dest?.mount_id,
          mount_alias: dest?.mount_alias,
          share: dest?.share,
          share_kind: dest?.share_kind,
          share_alias: dest?.share_alias,
          token: dest?.token?? "",
          path: dest?.path,
        }
    }}
  }