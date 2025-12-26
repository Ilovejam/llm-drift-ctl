"""
llm-drift-ctl

Production-grade LLM output validation package.
Validates LLM outputs using your own LLM when needed — and no LLM when not.
"""

from .drift_guard import DriftGuard
from .types import UserLLM, DriftGuardConfig, CheckInput, CheckResult, DriftLocation

__all__ = [
    "DriftGuard",
    "UserLLM",
    "DriftGuardConfig",
    "CheckInput",
    "CheckResult",
    "DriftLocation",
]

__version__ = "0.1.0"
