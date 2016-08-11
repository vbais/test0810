var data = {
    //staticData is fixed / reository data
    staticData: {
        dropDownOptions: [
            {
                id: 1,
                displayText: 'DTCC Swap',
                owners: [
                    'Art Venere', 'Lenna Paprocki', 'Simona Morasca'
                ],
                classification: 'Restricted FR'
            },
            {
                id: 2,
                displayText: 'FDIC Summary of Deposits',
                owners: [
                    'Shakia Mart', 'Olene Lindell', 'Shelton Diehl', 'Calandra Bickham', 'Asa Voyles'
                ],
                classification: 'External FR'
            },
            {
                id: 3,
                displayText: 'Y-14',
                owners: [
                    'Priya Ahuja', 'Tanya Anthony', 'Priyanka Banerjee', 'Wrench Cooler', 'SFlorencio Hanneman'
                ],
                classification: 'Restricted FR',
            }
        ],
        y14ResearchTypes: [
            { id: 1, displayText: 'Other Internal Analysis' },
            { id: 2, displayText: 'Other Supervisory Analysis' }
        ],
        y14Schedules: [
            {
                id: 1,
                fry14: 'A',
                schedule: 'A',
                description: 'Summary'
            },
            {
                id: 2,
                fry14: 'A',
                schedule: 'B',
                description: 'Scenario'
            },
            {
                id: 3,
                fry14: 'A',
                schedule: 'C',
                description: 'Regulatory Capital Instruments'
            },
            {
                id: 4,
                fry14: 'A',
                schedule: 'E',
                description: 'Operational Risks'
            },
            {
                id: 5,
                fry14: 'A',
                schedule: 'F',
                description: 'Business Plan Changes'
            },
            {
                id: 6,
                fry14: 'Q',
                schedule: 'A1',
                description: 'International Auto Loan'
            }, {
                id: 7,
                fry14: 'Q',
                schedule: 'A2',
                description: 'US Auto Loan'
            }, {
                id: 8,
                fry14: 'Q',
                schedule: 'A3',
                description: 'International Credit Card'
            }
        ]
    },

    //data saved by user for later use. This is stored in a column of accesRequest table
    reqData:
    {
        id: 1,
        frsDatasets: [
            { datasetId: 1 },
            { datasetId: 2 },
            {
                datasetId: 3,
                y14Data: {
                    y14ResearchTypes: {
                        id: 1
                    },
                    y14Schedules: [
                        { id: 1 },
                        { id: 2 },
                        { id: 4 },
                        { id: 6 }]
                }
            }
        ],
        frsCoAuthors: [
            { loginName: 'WCooler', name: 'Wrench Cooler', address: '5322 Otter Lane', termsOfUse: true, csiEligibility: false, dtccDataPolicy: true },
            { loginName: 'SMart', name: 'Shakia Mart', address: 'PSC 450 Box 297', termsOfUse: false, csiEligibility: false, dtccDataPolicy: true },
            { loginName: 'OLindell', name: 'Olene Lindell', address: '1807 Glenwood St. NE', termsOfUse: true, csiEligibility: true, dtccDataPolicy: false }
        ],
        frsAnalysts: [
            { loginName: 'IRichmond', name: 'Ivor Richmond', address: '6762 33 Ave N', termsOfUse: true, csiEligibility: false, dtccDataPolicy: true },
            { loginName: 'FCollins', name: 'Fuller Collins', address: 'Middle of JiangNan Road', termsOfUse: true, csiEligibility: true, dtccDataPolicy: false },
            { loginName: 'DBush', name: 'Demetrius Bush', address: '74 Green Street', termsOfUse: false, csiEligibility: true, dtccDataPolicy: true },
            { loginName: 'VMarquez', name: 'Vance Marquez', address: '42-1 Motohakone Hakonemaci', termsOfUse: true, csiEligibility: false, dtccDataPolicy: true }
        ],
        nonFrsCoAuthors: [
            {
                name: '',
                affiliation: true,
                email: ''
            },
            {
                name: '',
                affiliation: false,
                email: ''
            },
            {
                name: '',
                affiliation: true,
                email: ''
            },
            {
                name: '',
                affiliation: true,
                email: ''
            }
        ]
    }
};

module.exports = data;