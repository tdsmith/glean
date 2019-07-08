var N=null,E="",T="t",U="u",searchIndex={};
var R=["string","commonmetricdata","option","glean","test_get_value","Test-only API (exported for FFI purposes).","Public facing API for setting the metric to a date/time…","datetime","result","timeunit","duration","Set to the specified value.","should_record","category","glean_core","jsonvalue","Collect a snapshot for the given ping from storage and…","pingtype","Snapshot the given store and optionally clear it.","database","snapshot","to_string","try_from","try_into","borrow_mut","type_id","to_owned","clone_into","borrow","typeid","glean_core::metrics","dataerror","to_bytes","glean_core::ping","glean_core::storage","meta_mut","default","lifetime","labeledmetric","errorkind","formatter","serialize","deserialize","backtrace","CommonMetricData","Lifetime","ErrorType","PingType","TimeUnit","BooleanMetric","CounterMetric","DatetimeMetric","LabeledMetric","StringMetric","StringListMetric","TimespanMetric","UuidMetric","MetricType","PingMaker","StorageManager"];
searchIndex["glean_core"]={"doc":"Glean is a modern approach for recording and sending…","i":[[3,R[44],R[14],"The common set of data shared across all different metric…",N,N],[12,"name",E,"The metric's name.",0,N],[12,R[13],E,"The metric's category.",0,N],[12,"send_in_pings",E,"List of ping names to include this metric in.",0,N],[12,R[37],E,"The metric's lifetime.",0,N],[12,"disabled",E,"Whether or not the metric is disabled.",0,N],[3,"Error",E,"A specialized [`Error`] type for this crate's operations.",N,N],[3,"Glean",E,"The object holding meta information about a Glean instance.",N,N],[4,R[45],E,"The supported metrics' lifetimes.",N,N],[13,"Ping",E,"The metric is reset with each sent ping",1,N],[13,"Application",E,"The metric is reset on application restart",1,N],[13,"User",E,"The metric is reset with each user profile",1,N],[4,R[46],E,"The possible error types for metric recording.",N,N],[13,"InvalidValue",E,"For when the value to be recorded does not match the…",2,N],[13,"InvalidLabel",E,"For when the label of a labeled metric does not match the…",2,N],[5,"test_get_num_recorded_errors",E,"Get the number of recorded errors for the given metric and…",N,[[[R[2],["str"]],["errortype"],["str"],[R[1]],[R[3]]],[[R[8],["i32",R[0]]],[R[0]],["i32"]]]],[11,"as_str",E,"String representation of the lifetime.",1,[[],["str"]]],[11,"new",E,"Create a new metadata object.",0,[[[R[0]],["into",[R[0]]]],[R[1]]]],[11,"identifier",E,"The metric's unique identifier.",0,[[["self"]],[R[0]]]],[11,R[12],E,"Whether this metric should be recorded.",0,[[["self"]],["bool"]]],[11,"storage_names",E,"The list of storages this metric should be recorded into.",0,[[["self"]]]],[11,"kind",E,"Access the [`ErrorKind`] member.",3,[[["self"]],[R[39]]]],[11,R[21],E,"The error type's metric name",2,[[["self"]],["str"]]],[0,"metrics",E,"The different metric types supported by the Glean SDK to…",N,N],[3,R[49],R[30],"A boolean metric.",N,N],[3,R[50],E,"A counter metric.",N,N],[3,R[51],E,"A datetime metric.",N,N],[3,R[52],E,"A labeled metric.",N,N],[3,R[47],E,"Stores information about a ping.",N,N],[12,"name",E,"The name of the ping.",4,N],[12,"include_client_id",E,"Whether the ping should include the client ID.",4,N],[3,R[53],E,"A string metric.",N,N],[3,R[54],E,"A string list metric.",N,N],[3,R[55],E,"A timespan metric.",N,N],[3,R[56],E,"An UUID metric.",N,N],[4,R[48],E,"Different resolutions supported by the time related metric…",N,N],[13,"Nanosecond",E,"Truncate to nanosecond precision.",5,N],[13,"Microsecond",E,"Truncate to microsecond precision.",5,N],[13,"Millisecond",E,"Truncate to millisecond precision.",5,N],[13,"Second",E,"Truncate to second precision.",5,N],[13,"Minute",E,"Truncate to minute precision.",5,N],[13,"Hour",E,"Truncate to hour precision.",5,N],[13,"Day",E,"Truncate to day precision.",5,N],[4,"Metric",E,"The available metrics.",N,N],[13,"Boolean",E,"A boolean metric. See `BooleanMetric` for more information.",6,N],[13,"Counter",E,"A counter metric. See `CounterMetric` for more information.",6,N],[13,"Datetime",E,"A datetime metric. See `DatetimeMetric` for more…",6,N],[13,"String",E,"A string metric. See `StringMetric` for more information.",6,N],[13,"StringList",E,"A string list metric. See `StringListMetric` for more…",6,N],[13,"Uuid",E,"A UUID metric. See `UuidMetric` for more information.",6,N],[13,"Timespan",E,"A timespan metric. See `TimespanMetric` for more…",6,N],[11,"new",E,"Create a new boolean metric.",7,[[[R[1]]],["self"]]],[11,"set",E,"Set to the specified boolean value.",7,[[["bool"],["self"],[R[3]]]]],[11,R[4],E,R[5],7,[[["str"],["self"],[R[3]]],[["bool"],[R[2],["bool"]]]]],[11,"new",E,"Create a new counter metric.",8,[[[R[1]]],["self"]]],[11,"add",E,"Increase the counter by `amount`.",8,[[["i32"],["self"],[R[3]]]]],[11,R[4],E,R[5],8,[[["str"],["self"],[R[3]]],[[R[2],["i32"]],["i32"]]]],[11,"new",E,"Create a new datetime metric.",9,[[[R[9]],[R[1]]],["self"]]],[11,"set_with_details",E,R[6],9,[[["u32"],["i32"],["self"],[R[3]]]]],[11,"set",E,R[6],9,[[[R[2],[R[7]]],["self"],[R[7],["fixedoffset"]],[R[3]]]]],[11,"test_get_value_as_string",E,R[5],9,[[["str"],["self"],[R[3]]],[[R[2],[R[0]]],[R[0]]]]],[11,"new",E,"Create a new labeled metric from the given metric instance…",10,[[[R[2],["vec"]],[T],["vec",[R[0]]]],[R[38]]]],[11,"get",E,"Get a specific metric for a given label.",10,[[["self"],["str"],[R[3]]],[T]]],[11,"new",E,"Create a new ping type for the given name and whether to…",4,[[[R[0]],["into",[R[0]]],["bool"]],["self"]]],[11,"send",E,"Send the ping.",4,[[["bool"],["self"],[R[3]]],[[R[8],["bool"]],["bool"]]]],[11,"new",E,"Create a new string metric.",11,[[[R[1]]],["self"]]],[11,"set",E,R[11],11,[[[R[0]],["self"],["into",[R[0]]],[R[3]]]]],[11,R[4],E,R[5],11,[[["str"],["self"],[R[3]]],[[R[2],[R[0]]],[R[0]]]]],[11,"new",E,"Create a new string list metric.",12,[[[R[1]]],["self"]]],[11,"add",E,"Add a new string to the list.",12,[[[R[0]],["self"],["into",[R[0]]],[R[3]]]]],[11,"set",E,"Set to a specific list of strings.",12,[[[R[0]],["vec",[R[0]]],["self"],[R[3]]]]],[11,R[4],E,R[5],12,[[["str"],["self"],[R[3]]],[[R[2],["vec"]],["vec",[R[0]]]]]],[11,"test_get_value_as_json_string",E,R[5],12,[[["str"],["self"],[R[3]]],[[R[2],[R[0]]],[R[0]]]]],[11,"format_pattern",E,"How to format the given TimeUnit, truncating the time if…",5,[[],["str"]]],[11,"duration_convert",E,"Convert a duration to the requested time unit.",5,[[[R[10]]],["u64"]]],[11,"new",E,"Create a new timespan metric.",13,[[[R[9]],[R[1]]],["self"]]],[11,"set_start",E,"Start tracking time for the provided metric.",13,[[["self"],["u64"],[R[3]]]]],[11,"set_stop",E,"Stop tracking time for the provided metric. Sets the…",13,[[["self"],["u64"],[R[3]]]]],[11,"cancel",E,"Abort a previous `start` call. No error is recorded if no…",13,[[["self"]]]],[11,"set_raw",E,"Explicitly set the timespan value.",13,[[["bool"],[R[10]],["self"],[R[3]]]]],[11,R[4],E,R[5],13,[[["str"],["self"],[R[3]]],[[R[2],["u64"]],["u64"]]]],[11,"new",E,"Create a new UUID metric",14,[[[R[1]]],["self"]]],[11,"set",E,R[11],14,[[["uuid"],["self"],[R[3]]]]],[11,"generate_and_set",E,"Generate a new random UUID and set the metric to it.",14,[[["self"],[R[3]]],["uuid"]]],[11,"generate_if_missing",E,"Generate a new random UUID if none is stored yet.",14,[[["self"],[R[3]]]]],[11,R[4],E,R[5],14,[[["str"],["self"],[R[3]]],[[R[2],[R[0]]],[R[0]]]]],[8,R[57],E,"A `MetricType` describes common behavior across all metrics.",N,N],[10,"meta",E,"Access the stored metadata",15,[[["self"]],[R[1]]]],[10,R[35],E,"Access the stored metadata mutable",15,[[["self"]],[R[1]]]],[11,R[12],E,"Whether this metric should currently be recorded",15,[[["self"],[R[3]]],["bool"]]],[11,R[13],E,"The category the metric fits into.",6,[[["self"]],["str"]]],[11,"as_json",E,"The JSON representation of the metric's data",6,[[["self"]],[R[15]]]],[0,"ping",R[14],"Ping collection, assembly & submission.",N,N],[3,R[58],R[33],"Collect a ping's data, assemble it into its full payload…",N,N],[11,"new",E,"Create a new PingMaker.",16,[[],["self"]]],[11,"collect",E,R[16],16,[[["self"],[R[17]],[R[3]]],[[R[15]],[R[2],[R[15]]]]]],[11,"collect_string",E,R[16],16,[[["self"],[R[17]],[R[3]]],[[R[2],[R[0]]],[R[0]]]]],[11,"store_ping",E,"Store a ping to disk in the pings directory.",16,[[["path"],[R[15]],["str"],["self"]],[R[8]]]],[0,"storage",R[14],"Storage snapshotting.",N,N],[3,R[59],R[34],"Snapshot metrics from the underlying database.",N,N],[11,R[20],E,R[18],17,[[[R[19]],["str"],["self"],["bool"]],[[R[2],[R[0]]],[R[0]]]]],[11,"snapshot_as_json",E,R[18],17,[[[R[19]],["str"],["self"],["bool"]],[[R[15]],[R[2],[R[15]]]]]],[11,"snapshot_metric",E,"Get the current value of a single metric identified by name.",17,[[[R[19]],["str"],["self"]],[[R[2],["metric"]],["metric"]]]],[6,"Result",R[14],"A specialized [`Result`] type for this crate's operations.",N,N],[11,"new",E,"Create and initialize a new Glean object.",18,[[["bool"],["str"]],[R[8]]]],[11,"set_upload_enabled",E,"Set whether upload is enabled or not.",18,[[["self"],["bool"]]]],[11,"is_upload_enabled",E,"Determine whether upload is enabled.",18,[[["self"]],["bool"]]],[11,"get_application_id",E,"Get the application ID as specified on instantiation.",18,[[["self"]],["str"]]],[11,"get_data_path",E,"Get the data path of this instance.",18,[[["self"]],["path"]]],[11,"storage",E,"Get a handle to the database.",18,[[["self"]],[R[19]]]],[11,R[20],E,"Take a snapshot for the given store and optionally clear it.",18,[[["self"],["bool"],["str"]],[R[0]]]],[11,"send_ping",E,"Send a ping.",18,[[["self"],[R[17]],["bool"]],[[R[8],["bool"]],["bool"]]]],[11,"send_ping_by_name",E,"Send a ping by name.",18,[[["bool"],["self"],["str"]],[[R[8],["bool"]],["bool"]]]],[11,"get_ping_by_name",E,"Get a `PingType` by name.",18,[[["self"],["str"]],[[R[2],[R[17]]],[R[17]]]]],[11,"register_ping_type",E,"Register a new `PingType`.",18,[[["self"],[R[17]]]]],[11,"from",E,E,0,[[[T]],[T]]],[11,"into",E,E,0,[[],[U]]],[11,R[26],E,E,0,[[["self"]],[T]]],[11,R[27],E,E,0,[[[T],["self"]]]],[11,R[22],E,E,0,[[[U]],[R[8]]]],[11,R[23],E,E,0,[[],[R[8]]]],[11,R[24],E,E,0,[[["self"]],[T]]],[11,R[28],E,E,0,[[["self"]],[T]]],[11,R[25],E,E,0,[[["self"]],[R[29]]]],[11,R[21],E,E,3,[[["self"]],[R[0]]]],[11,"from",E,E,3,[[[T]],[T]]],[11,"into",E,E,3,[[],[U]]],[11,R[22],E,E,3,[[[U]],[R[8]]]],[11,R[23],E,E,3,[[],[R[8]]]],[11,R[24],E,E,3,[[["self"]],[T]]],[11,R[28],E,E,3,[[["self"]],[T]]],[11,R[25],E,E,3,[[["self"]],[R[29]]]],[11,"as_fail",E,E,3,[[["self"]],["fail"]]],[11,"from",E,E,18,[[[T]],[T]]],[11,"into",E,E,18,[[],[U]]],[11,R[22],E,E,18,[[[U]],[R[8]]]],[11,R[23],E,E,18,[[],[R[8]]]],[11,R[24],E,E,18,[[["self"]],[T]]],[11,R[28],E,E,18,[[["self"]],[T]]],[11,R[25],E,E,18,[[["self"]],[R[29]]]],[11,"from",E,E,1,[[[T]],[T]]],[11,"into",E,E,1,[[],[U]]],[11,R[26],E,E,1,[[["self"]],[T]]],[11,R[27],E,E,1,[[[T],["self"]]]],[11,R[22],E,E,1,[[[U]],[R[8]]]],[11,R[23],E,E,1,[[],[R[8]]]],[11,R[24],E,E,1,[[["self"]],[T]]],[11,R[28],E,E,1,[[["self"]],[T]]],[11,R[25],E,E,1,[[["self"]],[R[29]]]],[11,"from",E,E,2,[[[T]],[T]]],[11,"into",E,E,2,[[],[U]]],[11,R[22],E,E,2,[[[U]],[R[8]]]],[11,R[23],E,E,2,[[],[R[8]]]],[11,R[24],E,E,2,[[["self"]],[T]]],[11,R[28],E,E,2,[[["self"]],[T]]],[11,R[25],E,E,2,[[["self"]],[R[29]]]],[11,"from",R[30],E,7,[[[T]],[T]]],[11,"into",E,E,7,[[],[U]]],[11,R[26],E,E,7,[[["self"]],[T]]],[11,R[27],E,E,7,[[[T],["self"]]]],[11,R[22],E,E,7,[[[U]],[R[8]]]],[11,R[23],E,E,7,[[],[R[8]]]],[11,R[24],E,E,7,[[["self"]],[T]]],[11,R[28],E,E,7,[[["self"]],[T]]],[11,R[25],E,E,7,[[["self"]],[R[29]]]],[11,"from",E,E,8,[[[T]],[T]]],[11,"into",E,E,8,[[],[U]]],[11,R[26],E,E,8,[[["self"]],[T]]],[11,R[27],E,E,8,[[[T],["self"]]]],[11,R[22],E,E,8,[[[U]],[R[8]]]],[11,R[23],E,E,8,[[],[R[8]]]],[11,R[24],E,E,8,[[["self"]],[T]]],[11,R[28],E,E,8,[[["self"]],[T]]],[11,R[25],E,E,8,[[["self"]],[R[29]]]],[11,"from",E,E,9,[[[T]],[T]]],[11,"into",E,E,9,[[],[U]]],[11,R[22],E,E,9,[[[U]],[R[8]]]],[11,R[23],E,E,9,[[],[R[8]]]],[11,R[24],E,E,9,[[["self"]],[T]]],[11,R[28],E,E,9,[[["self"]],[T]]],[11,R[25],E,E,9,[[["self"]],[R[29]]]],[11,"from",E,E,10,[[[T]],[T]]],[11,"into",E,E,10,[[],[U]]],[11,R[26],E,E,10,[[["self"]],[T]]],[11,R[27],E,E,10,[[[T],["self"]]]],[11,R[22],E,E,10,[[[U]],[R[8]]]],[11,R[23],E,E,10,[[],[R[8]]]],[11,R[24],E,E,10,[[["self"]],[T]]],[11,R[28],E,E,10,[[["self"]],[T]]],[11,R[25],E,E,10,[[["self"]],[R[29]]]],[11,"from",E,E,4,[[[T]],[T]]],[11,"into",E,E,4,[[],[U]]],[11,R[26],E,E,4,[[["self"]],[T]]],[11,R[27],E,E,4,[[[T],["self"]]]],[11,R[22],E,E,4,[[[U]],[R[8]]]],[11,R[23],E,E,4,[[],[R[8]]]],[11,R[24],E,E,4,[[["self"]],[T]]],[11,R[28],E,E,4,[[["self"]],[T]]],[11,R[25],E,E,4,[[["self"]],[R[29]]]],[11,"from",E,E,11,[[[T]],[T]]],[11,"into",E,E,11,[[],[U]]],[11,R[26],E,E,11,[[["self"]],[T]]],[11,R[27],E,E,11,[[[T],["self"]]]],[11,R[22],E,E,11,[[[U]],[R[8]]]],[11,R[23],E,E,11,[[],[R[8]]]],[11,R[24],E,E,11,[[["self"]],[T]]],[11,R[28],E,E,11,[[["self"]],[T]]],[11,R[25],E,E,11,[[["self"]],[R[29]]]],[11,"from",E,E,12,[[[T]],[T]]],[11,"into",E,E,12,[[],[U]]],[11,R[26],E,E,12,[[["self"]],[T]]],[11,R[27],E,E,12,[[[T],["self"]]]],[11,R[22],E,E,12,[[[U]],[R[8]]]],[11,R[23],E,E,12,[[],[R[8]]]],[11,R[24],E,E,12,[[["self"]],[T]]],[11,R[28],E,E,12,[[["self"]],[T]]],[11,R[25],E,E,12,[[["self"]],[R[29]]]],[11,"from",E,E,13,[[[T]],[T]]],[11,"into",E,E,13,[[],[U]]],[11,R[22],E,E,13,[[[U]],[R[8]]]],[11,R[23],E,E,13,[[],[R[8]]]],[11,R[24],E,E,13,[[["self"]],[T]]],[11,R[28],E,E,13,[[["self"]],[T]]],[11,R[25],E,E,13,[[["self"]],[R[29]]]],[11,"from",E,E,14,[[[T]],[T]]],[11,"into",E,E,14,[[],[U]]],[11,R[26],E,E,14,[[["self"]],[T]]],[11,R[27],E,E,14,[[[T],["self"]]]],[11,R[22],E,E,14,[[[U]],[R[8]]]],[11,R[23],E,E,14,[[],[R[8]]]],[11,R[24],E,E,14,[[["self"]],[T]]],[11,R[28],E,E,14,[[["self"]],[T]]],[11,R[25],E,E,14,[[["self"]],[R[29]]]],[11,"from",E,E,5,[[[T]],[T]]],[11,"into",E,E,5,[[],[U]]],[11,R[26],E,E,5,[[["self"]],[T]]],[11,R[27],E,E,5,[[[T],["self"]]]],[11,R[22],E,E,5,[[[U]],[R[8]]]],[11,R[23],E,E,5,[[],[R[8]]]],[11,R[24],E,E,5,[[["self"]],[T]]],[11,R[28],E,E,5,[[["self"]],[T]]],[11,R[25],E,E,5,[[["self"]],[R[29]]]],[11,R[32],E,E,5,[[["self"]],[[R[8],["vec",R[31]]],[R[31]],["vec",["u8"]]]]],[11,"from",E,E,6,[[[T]],[T]]],[11,"into",E,E,6,[[],[U]]],[11,R[26],E,E,6,[[["self"]],[T]]],[11,R[27],E,E,6,[[[T],["self"]]]],[11,R[22],E,E,6,[[[U]],[R[8]]]],[11,R[23],E,E,6,[[],[R[8]]]],[11,R[24],E,E,6,[[["self"]],[T]]],[11,R[28],E,E,6,[[["self"]],[T]]],[11,R[25],E,E,6,[[["self"]],[R[29]]]],[11,R[32],E,E,6,[[["self"]],[[R[8],["vec",R[31]]],[R[31]],["vec",["u8"]]]]],[11,"from",R[33],E,16,[[[T]],[T]]],[11,"into",E,E,16,[[],[U]]],[11,R[22],E,E,16,[[[U]],[R[8]]]],[11,R[23],E,E,16,[[],[R[8]]]],[11,R[24],E,E,16,[[["self"]],[T]]],[11,R[28],E,E,16,[[["self"]],[T]]],[11,R[25],E,E,16,[[["self"]],[R[29]]]],[11,"from",R[34],E,17,[[[T]],[T]]],[11,"into",E,E,17,[[],[U]]],[11,R[22],E,E,17,[[[U]],[R[8]]]],[11,R[23],E,E,17,[[],[R[8]]]],[11,R[24],E,E,17,[[["self"]],[T]]],[11,R[28],E,E,17,[[["self"]],[T]]],[11,R[25],E,E,17,[[["self"]],[R[29]]]],[11,"meta",R[30],E,7,[[["self"]],[R[1]]]],[11,R[35],E,E,7,[[["self"]],[R[1]]]],[11,"meta",E,E,8,[[["self"]],[R[1]]]],[11,R[35],E,E,8,[[["self"]],[R[1]]]],[11,"meta",E,E,9,[[["self"]],[R[1]]]],[11,R[35],E,E,9,[[["self"]],[R[1]]]],[11,"meta",E,E,11,[[["self"]],[R[1]]]],[11,R[35],E,E,11,[[["self"]],[R[1]]]],[11,"meta",E,E,12,[[["self"]],[R[1]]]],[11,R[35],E,E,12,[[["self"]],[R[1]]]],[11,"meta",E,E,13,[[["self"]],[R[1]]]],[11,R[35],E,E,13,[[["self"]],[R[1]]]],[11,"meta",E,E,14,[[["self"]],[R[1]]]],[11,R[35],E,E,14,[[["self"]],[R[1]]]],[11,R[36],R[14],E,1,[[],["self"]]],[11,R[36],E,E,0,[[],[R[1]]]],[11,R[36],R[33],E,16,[[],["self"]]],[11,"clone",R[14],E,1,[[["self"]],[R[37]]]],[11,"clone",E,E,0,[[["self"]],[R[1]]]],[11,"clone",R[30],E,7,[[["self"]],["booleanmetric"]]],[11,"clone",E,E,8,[[["self"]],["countermetric"]]],[11,"clone",E,E,10,[[["self"]],[R[38]]]],[11,"clone",E,E,4,[[["self"]],[R[17]]]],[11,"clone",E,E,11,[[["self"]],["stringmetric"]]],[11,"clone",E,E,12,[[["self"]],["stringlistmetric"]]],[11,"clone",E,E,5,[[["self"]],[R[9]]]],[11,"clone",E,E,14,[[["self"]],["uuidmetric"]]],[11,"clone",E,E,6,[[["self"]],["metric"]]],[11,"from",R[14],E,3,[[["context",[R[39]]],[R[39]]],["error"]]],[11,"from",E,E,3,[[["handleerror"]],["error"]]],[11,"from",E,E,3,[[["error"]],["error"]]],[11,"from",E,E,3,[[["storeerror"]],["error"]]],[11,"from",E,E,3,[[["error"]],["error"]]],[11,"eq",E,E,1,[[["self"],[R[37]]],["bool"]]],[11,"fmt",E,E,1,[[["self"],[R[40]]],[R[8]]]],[11,"fmt",E,E,0,[[["self"],[R[40]]],[R[8]]]],[11,"fmt",E,E,3,[[["self"],[R[40]]],[R[8]]]],[11,"fmt",E,E,2,[[["self"],[R[40]]],[R[8]]]],[11,"fmt",R[30],E,7,[[["self"],[R[40]]],[R[8]]]],[11,"fmt",E,E,8,[[["self"],[R[40]]],[R[8]]]],[11,"fmt",E,E,9,[[["self"],[R[40]]],[R[8]]]],[11,"fmt",E,E,10,[[["self"],[R[40]]],[R[8]]]],[11,"fmt",E,E,4,[[["self"],[R[40]]],[R[8]]]],[11,"fmt",E,E,11,[[["self"],[R[40]]],[R[8]]]],[11,"fmt",E,E,12,[[["self"],[R[40]]],[R[8]]]],[11,"fmt",E,E,5,[[["self"],[R[40]]],[R[8]]]],[11,"fmt",E,E,13,[[["self"],[R[40]]],[R[8]]]],[11,"fmt",E,E,14,[[["self"],[R[40]]],[R[8]]]],[11,"fmt",E,E,6,[[["self"],[R[40]]],[R[8]]]],[11,"fmt",R[14],E,18,[[["self"],[R[40]]],[R[8]]]],[11,"fmt",E,E,3,[[["self"],[R[40]]],[R[8]]]],[11,R[22],E,E,1,[[["i32"]],[[R[8],[R[37]]],[R[37]]]]],[11,R[22],R[30],E,5,[[["i32"]],[[R[8],[R[9]]],[R[9]]]]],[11,R[41],E,E,5,[[["self"],["__s"]],[R[8]]]],[11,R[41],E,E,6,[[["self"],["__s"]],[R[8]]]],[11,R[42],E,E,5,[[["__d"]],[R[8]]]],[11,R[42],E,E,6,[[["__d"]],[R[8]]]],[11,"cause",R[14],E,3,[[["self"]],[["fail"],[R[2],["fail"]]]]],[11,R[43],E,E,3,[[["self"]],[[R[2],[R[43]]],[R[43]]]]]],"p":[[3,R[44]],[4,R[45]],[4,R[46]],[3,"Error"],[3,R[47]],[4,R[48]],[4,"Metric"],[3,R[49]],[3,R[50]],[3,R[51]],[3,R[52]],[3,R[53]],[3,R[54]],[3,R[55]],[3,R[56]],[8,R[57]],[3,R[58]],[3,R[59]],[3,"Glean"]]};
searchIndex["glean_ffi"]={"doc":E,"i":[[5,"glean_enable_logging","glean_ffi","Initialize the logging system based on the target…",N,[[]]],[5,"glean_initialize",E,E,N,[[["ffistr"],["u8"]],["u64"]]],[5,"glean_is_upload_enabled",E,E,N,[[["u64"]],["u8"]]],[5,"glean_set_upload_enabled",E,E,N,[[["u64"],["u8"]]]],[5,"glean_send_ping",E,E,N,[[["u64"],["u8"]],["u8"]]],[5,"glean_send_ping_by_name",E,E,N,[[["ffistr"],["u64"],["u8"]],["u8"]]],[5,"glean_ping_collect",E,E,N,[[["u64"]]]],[5,"glean_destroy_glean",E,E,N,[[["externerror"],["u64"]]]],[5,"glean_str_free",E,"Public destructor for strings managed by the other side of…",N,[[]]]],"p":[]};
initSearch(searchIndex);addSearchOptions(searchIndex);