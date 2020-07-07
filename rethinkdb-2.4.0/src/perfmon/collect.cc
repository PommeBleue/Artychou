// Copyright 2010-2012 RethinkDB, all rights reserved.
#include "perfmon/collect.hpp"

#include "concurrency/pmap.hpp"
#include "rdb_protocol/datum.hpp"
#include "utils.hpp"

/* This is the function that actually gathers the stats. It is illegal to create or destroy
perfmon_t objects while perfmon_get_stats is active. */
static void co_perfmon_visit(int thread, void *data) {
    on_thread_t moving((threadnum_t(thread)));
    get_global_perfmon_collection().visit_stats(data);
}

int get_num_threads();

ql::datum_t perfmon_get_stats() {
    void *data = get_global_perfmon_collection().begin_stats();
    pmap(get_num_threads(), std::bind(&co_perfmon_visit, ph::_1, data));
    return get_global_perfmon_collection().end_stats(data);
}

