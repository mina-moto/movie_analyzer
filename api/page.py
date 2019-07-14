from enum import Enum
class Page(Enum):
    # 公開中の映画リストのページ
    NOW = {"name":"上映中の映画","url":"https://filmarks.com/list/now"}
    COMING={"name":"公開予定の映画","url":"https://filmarks.com/list/coming"}
    RENTAL_NOW={"name":"新作レンタル開始の映画","url":"https://filmarks.com/list/rental_now"}
    RENTAL_COMING={"name":"近日レンタル開始予定の映画","url":"https://filmarks.com/list/rental_coming"}
    ACADEMY_AWAR={"name":"アカデミー賞受賞映画作品","url":"https://filmarks.com/list/award/1"}
    HULU={"name":"Huluで視聴可能な映画","url":"https://filmarks.com/list/vod/hulu"}
    NETFLIX={"name":"Netflixで視聴可能な映画","url":"https://filmarks.com/list/vod/netflix"}
