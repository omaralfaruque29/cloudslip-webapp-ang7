export let CpuTypes = [
    { value: .25 },
    { value: .5 },
    { value: 1 },
    { value: 1.5 },
    { value: 2 },
    { value: 2.5 }
];

export let MaxRams = [
    { value: 1 },
    { value: 2 },
    { value: 4 },
    { value: 8 },
    { value: 16 }
];

export let ApplicationBuildTypes = [
    { name: 'Select application build type', value: null },
    { name: 'Maven', value: 'MAVEN' },
    { name: 'Gradle', value: 'GRADLE' },
];

export let SuccssorTriggerMode = [
    { name: 'Select a trigger mode', value: null },
    { name: 'Automatic', value: 'AUTOMATIC' },
    { name: 'Manual', value: 'MANUAL' }
]

export let ApplicationTypes = [
    // { name: "Select a app type", value: null },
    { name: "Spring Boot", value: "SPRING_BOOT", src: "/assets/images/icon/spring_boot.svg" },
    { name: "ExpressJS", value: "EXPRESS_JS", src: "/assets/images/icon/expressjs.svg" },
    { name: "LARAVEL", value: "LARAVEL", src: "/assets/images/icon/laravel.svg" },
    { name: "DOT NET", value: "DOT_NET", src: "/assets/images/icon/dotnet.svg" },
    { name: "DJANGO", value: "DJANGO", src: "/assets/images/icon/django.svg" },

]