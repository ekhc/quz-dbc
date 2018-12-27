
let id = 800;

class TodoController {


    createTodo(req, res) {

        id+=1;

        res.json({
            id: id,
            name: req.body.name,
            created_at: "2018-12-02 12:32:56",
            updated_at: "2018-12-02 12:32:56"
        });
    }

    getList(req, res) {
        res.json({
            current_page: 1,
            data: [
                {
                    id: 771,
                    name: "dsfsdfa",
                    created_at: "2018-12-02 12:32:43",
                    updated_at: "2018-12-02 12:32:43"
                },
                {
                    id: 774,
                    name: "12344",
                    created_at: "2018-12-02 12:32:56",
                    updated_at: "2018-12-02 12:32:56"
                },
                {
                    id: 775,
                    name: "123456",
                    created_at: "2018-12-02 12:33:01",
                    updated_at: "2018-12-02 12:33:01"
                },
                {
                    id: 777,
                    name: "ㄷㄹㅈ",
                    created_at: "2018-12-02 12:33:58",
                    updated_at: "2018-12-02 12:33:58"
                },
                {
                    id: 778,
                    name: "ㅈㄷㄱㅈㄷㄱ",
                    created_at: "2018-12-02 12:34:01",
                    updated_at: "2018-12-02 12:34:01"
                },
                {
                    id: 779,
                    name: "123",
                    created_at: "2018-12-02 12:34:06",
                    updated_at: "2018-12-02 12:34:06"
                },
                {
                    id: 781,
                    name: "ㅓㅏㅣ",
                    created_at: "2018-12-03 02:02:48",
                    updated_at: "2018-12-03 02:02:48"
                },
                {
                    id: 783,
                    name: "ㅇㅇㅇ",
                    created_at: "2018-12-03 02:23:59",
                    updated_at: "2018-12-03 02:23:59"
                },
                {
                    id: 785,
                    name: "sssss",
                    created_at: "2018-12-03 06:06:37",
                    updated_at: "2018-12-03 06:06:37"
                },
                {
                    id: 793,
                    name: "와우",
                    created_at: "2018-12-03 09:12:37",
                    updated_at: "2018-12-03 09:12:37"
                },
                {
                    id: 794,
                    name: "ㅇ",
                    created_at: "2018-12-04 01:09:39",
                    updated_at: "2018-12-04 01:09:39"
                },
                {
                    id: 795,
                    name: "ㅁㅈㅈ",
                    created_at: "2018-12-04 01:09:42",
                    updated_at: "2018-12-04 01:09:42"
                },
                {
                    id: 797,
                    name: "안녕하세요",
                    created_at: "2018-12-04 05:55:58",
                    updated_at: "2018-12-04 05:55:58"
                },
                {
                    id: 799,
                    name: "ㄴㅇㄹㄴㄹ",
                    created_at: "2018-12-05 01:04:39",
                    updated_at: "2018-12-05 01:04:39"
                },
                {
                    id: 801,
                    name: "sadfasdf",
                    created_at: "2018-12-05 01:09:10",
                    updated_at: "2018-12-05 01:09:10"
                }
            ],
            first_page_url: "https://todos.garam.xyz/api/todos?page=1",
            from: 1,
            last_page: 3,
            last_page_url: "https://todos.garam.xyz/api/todos?page=3",
            next_page_url: "https://todos.garam.xyz/api/todos?page=2",
            path: "https://todos.garam.xyz/api/todos",
            per_page: 15,
            prev_page_url: null,
            to: 15,
            total: 33
        });
    }


}

module.exports = TodoController;
