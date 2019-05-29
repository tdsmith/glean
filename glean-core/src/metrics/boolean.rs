// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

use crate::metrics::Metric;
use crate::metrics::MetricType;
use crate::storage::StorageManager;
use crate::CommonMetricData;
use crate::Glean;

/// # A boolean metric
///
/// Records a simple flag.
#[derive(Clone, Debug)]
pub struct BooleanMetric {
    meta: CommonMetricData,
}

impl MetricType for BooleanMetric {
    fn meta(&self) -> &CommonMetricData {
        &self.meta
    }

    fn meta_mut(&mut self) -> &mut CommonMetricData {
        &mut self.meta
    }
}

impl BooleanMetric {
    /// Create a new metric
    pub fn new(meta: CommonMetricData) -> Self {
        Self { meta }
    }

    /// Set to the specified boolean value
    pub fn set(&self, glean: &Glean, value: bool) {
        if !self.should_record(glean) {
            return;
        }

        let value = Metric::Boolean(value);
        glean.storage().record(&self.meta, &value)
    }

    /// **Test-only API (exported for FFI purposes).**
    ///
    /// Get the currently stored value as a boolean.
    ///
    /// This doesn't clear the stored value.
    pub fn test_get_value(&self, glean: &Glean, storage_name: &str) -> Option<bool> {
        match StorageManager.snapshot_metric(glean.storage(), storage_name, &self.meta.identifier())
        {
            Some(Metric::Boolean(b)) => Some(b),
            _ => None,
        }
    }
}
