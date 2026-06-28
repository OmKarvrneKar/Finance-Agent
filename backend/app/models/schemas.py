from pydantic import BaseModel
from datetime import date as date_type, datetime
from typing import List, Dict, Optional

class TransactionBase(BaseModel):
    date: date_type
    description: str
    amount: float
    transaction_type: str  # 'debit' or 'credit'
    category: str
    subcategory: Optional[str] = None
    is_recurring: bool = False
    raw_text: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class UploadSummaryResponse(BaseModel):
    total_transactions: int
    total_spent: float
    category_breakdown: Dict[str, int]
    new_transactions: int
    duplicate_transactions: int
    total_in_file: int

class PaginatedTransactionsResponse(BaseModel):
    transactions: List[TransactionResponse]
    total: int
    page: int
    limit: int
    pages: int
