float sdCircle( in vec2 p, in float r ) 
{
    return length(p)-r;
}

#pragma glslify: export(sdCircle)